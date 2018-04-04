node('jenkins-aws')
{

  stage('Checkout Repo')
  {
      checkout([$class: 'GitSCM',
      branches: [[name: '*/develop']],
      doGenerateSubmoduleConfigurations: false,
      extensions: [],
      submoduleCfg: [],
      userRemoteConfigs: [[credentialsId: 'bitbucket',
      url: 'git@bitbucket.org:bridestory/bridestory-vendor-home.git']]])
  }
  stage('Build Image')
  {
    sh 'docker build -f Dockerfile.staging -t 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:staging-${BUILD_NUMBER} .'
  }

  stage('Push Docker Image')
  {
    sh 'awsdockerlogin'
    sh 'docker push 172405484086.dkr.ecr.ap-southeast-1.amazonaws.com/vendor-home:staging-${BUILD_NUMBER}'
  }

  stage('Create New Task')
  {
      sh 'sed -e "s:BUILD_NUMBER:${BUILD_NUMBER}:g" task-template-staging.json > task-template-staging-${BUILD_NUMBER}.json'
      sh 'aws ecs register-task-definition --family vendor-home-staging-task --cli-input-json file://task-template-staging-${BUILD_NUMBER}.json'
  }
  
  stage('Update Service')
  {
      sh 'bash update-service-staging'
  }

}
