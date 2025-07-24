#This is Authnitication Lambda file
import boto3
import json

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', region_name='ap-south-1')
dynamodbTableName = 'employee'
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
employeeTable = dynamodb.Table(dynamodbTableName)
bucketName = 'subhrasis-visitor-image-storage'

def lambda_handler(event, context):
    print(event)
    objectKey = event['queryStringParameters']['objectKey']
    
    # Fetch the image from S3
    image_bytes = s3.get_object(Bucket=bucketName, Key=objectKey)['Body'].read()
    
    try:
        # Rekognition to search for faces in the image
        response = rekognition.search_faces_by_image(
            CollectionId='employees',
            Image={'Bytes': image_bytes}
        )

        # Loop through all matches and look for a corresponding record in DynamoDB
        for match in response.get('FaceMatches', []):
            rekognition_id = match['Face']['FaceId']
            print(f"Match found: Rekognition FaceId={rekognition_id}, Confidence={match['Face']['Confidence']}")
            
            # Fetch employee data from DynamoDB
            try:
                face = employeeTable.get_item(Key={'rekognitionid': rekognition_id})
                if 'Item' in face:
                    print('Person Found: ', face['Item'])
                    return buildResponse(200, {
                        'Message': 'Success',
                        'firstName': face['Item']['firstName'],
                        'lastName': face['Item']['lastName']
                    })
            except Exception as e:
                print(f"Error accessing DynamoDB: {e}")
                return buildResponse(500, {'Message': 'Internal Server Error'})
        
        # If no matches are found
        print('Person could not be recognized.')
        return buildResponse(403, {'Message': 'Person Not Found'})
    
    except Exception as e:
        print(f"Error during Rekognition process: {e}")
        return buildResponse(500, {'Message': 'Internal Server Error'})
    
def buildResponse(statusCode, body=None):
    response = {
        'statusCode': statusCode,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    if body is not None:
        response['body'] = json.dumps(body)
    return response
