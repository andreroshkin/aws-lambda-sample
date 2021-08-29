# Lambda workshop

## Steps
1. Create s3 Bucket
2. Upload test files
3. Create function
4. Function permissions
5. Create Layout
6. Create test case
7. Deploy
8. Run

## Layout structure sample
``
xray-sdk.zip
└ nodejs/node_modules/aws-xray-sdk
``

## Test case
``
{
    "bucket" : "ct-bucket-v1", 
    "keys" : ["test1.txt", "test2.txt"],
    "outputBucket" : "ct-bucket-v1",
    "outputKey" : "result.zip"
}
``