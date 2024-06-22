import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings

def upload_to_aws(file_obj, bucket, s3_file_name):
    session = boto3.Session(
        aws_access_key_id='AKIA6ODU6XD4OCV4IJAU',
        aws_secret_access_key='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',
        region_name='us-east-2'
    )
    s3 = session.client('s3')

    try:
        s3.upload_fileobj(file_obj, bucket, s3_file_name)
        url = f"https://{bucket}.s3.{s3.meta.region_name}.amazonaws.com/{s3_file_name}"
        return url
    except NoCredentialsError:
        print("Credentials not available")
        return None
