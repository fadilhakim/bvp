docker run --rm --name vendor-home-staging -d -P 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:staging-${BUILD_NUMBER}
PAYMENT_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' vendor-home-staging`
ENDPOINT_URL="home"
sleep 10s
RESPONSE_CODE=`curl -I -X GET http://$PAYMENT_IP/$ENDPOINT_URL | head -n1 | awk '{ print $2 }'`
if [[ $RESPONSE_CODE != "200" ]]
then
	echo "Tests Failed! - Return code $RESPONSE_CODE"
	docker stop vendor-home-staging
	exit 1
else
	echo "Tests Passed"
	docker stop vendor-home-staging
	exit 0
fi