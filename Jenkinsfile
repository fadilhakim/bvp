node('jenkins-aws')
{

  stage('Checkout Repo')
  {
      checkout([$class: 'GitSCM',
      branches: [[name: '*/develop']], 
      doGenerateSubmoduleConfigurations: false,
      extensions: [],
      submoduleCfg: [],
      userRemoteConfigs: [[credentialsId: '86dee152-8902-4693-a4d8-b721093c6a41',
      url: 'git@bitbucket.org:bridestory/bridestory-vendor-home.git']]])
  }
  stage('Build Image')
  {
    sh 'docker build -f Dockerfile.staging -t asia.gcr.io/staging-176502/vendor-home:staging-${BUILD_NUMBER} .'
  }

  stage('Push Docker Image')
  {
    sh 'gcloud docker -- push asia.gcr.io/staging-176502/vendor-home:staging-${BUILD_NUMBER}'
  }

  stage('Deploy To Staging')
  {
    sh 'gcloud container clusters get-credentials staging-cluster --zone asia-southeast1-a --project staging-176502'
    sh 'kubectl set image deployment/vendor-home-staging-deployment vendor-home-staging=asia.gcr.io/staging-176502/vendor-home:staging-${BUILD_NUMBER}'
  }

}
