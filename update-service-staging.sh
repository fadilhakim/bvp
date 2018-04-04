TASK_REVISION=`aws ecs describe-task-definition --task-definition vendor-home-staging-task | egrep "revision" | tr "/" " " | awk '{ print $2 }' | sed 's/,$//'`
DESIRED_COUNT=`aws ecs describe-services --services arn:aws:ecs:ap-southeast-1:172405484086:service/vendor-home-staging-service --cluster arn:aws:ecs:ap-southeast-1:172405484086:cluster/frontend-staging-cluster | egrep "desiredCount" | tr "/" " " | awk '{print $2}' | sed 's/,$//' | head -n1`
if [ ${DESIRED_COUNT} = "0" ]; then
    DESIRED_COUNT="1"
fi
aws ecs update-service --cluster arn:aws:ecs:ap-southeast-1:172405484086:cluster/frontend-staging-cluster --service arn:aws:ecs:ap-southeast-1:172405484086:service/vendor-home-staging-service --task-definition vendor-home-staging-task:${TASK_REVISION} --desired-count ${DESIRED_COUNT}
