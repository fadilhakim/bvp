node('jenkins-aws')
{

  stage('Checkout Repo')
  {
      checkout([$class: 'GitSCM',
      branches: [[name: '*/release/1.0.0']],
      doGenerateSubmoduleConfigurations: false,
      extensions: [],
      submoduleCfg: [],
      userRemoteConfigs: [[credentialsId: 'bitbucket',
      url: 'git@bitbucket.org:bridestory/bridestory-vendor-home.git']]])
  }
  stage('Build Image')
  {
    sh 'docker build -f Dockerfile.staging -t 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:staging-${BRANCH_NAME}-${BUILD_NUMBER} .'
  }

  stage('Container Testing')
  {
    sh 'bash container-testing.sh'
  }

  stage('Push Docker Image')
  {
    sh 'awsdockerlogin'
    sh 'docker push 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:staging-${BRANCH_NAME}-${BUILD_NUMBER}'
  }

  stage('Create New Task')
  {
      sh 'sed -e "s:BUILD_NUMBER:${BUILD_NUMBER}:g" task-template-staging.json > task-template-staging-${BUILD_NUMBER}.json'
      sh 'sed -e "s:BRANCH_NAME:${BRANCH_NAME}:g" task-template-staging-${BUILD_NUMBER}.json > task-template-staging-deploy.json'
      sh 'aws ecs register-task-definition --family vendor-home-staging-task --cli-input-json file://task-template-staging-deploy.json'
      sh 'rm task-template-staging-${BUILD_NUMBER}.json'
  }

  stage('Update Service')
  {
      sh 'bash update-service-staging.sh'
  }

}
