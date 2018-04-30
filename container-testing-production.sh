docker run --rm --name vendor-home-production -d -P 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:production-${BUILD_NUMBER}
VENDOR_IP=`docker inspect --format '{{ .NetworkSettings.IPAddress }}' vendor-home-production`
ENDPOINT_URL="home"
sleep 30s
RESPONSE_CODE=`curl -I -X GET http://$VENDOR_IP:3000/$ENDPOINT_URL | head -n1 | awk '{ print $2 }'`
if [[ $RESPONSE_CODE != "200" ]]
then
	echo "Tests Failed! - Return code $RESPONSE_CODE"
	docker stop vendor-home-production
	exit 1
else
	echo "Tests Passed"
	docker stop vendor-home-production
	exit 0
fi