pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh '''
                    set -eux

                    git config --global --add safe.directory /home/rajit/shiro-automation-docs || true

                    cd /home/rajit/shiro-automation-docs

                    chmod +x deploy.sh
                    ./deploy.sh
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful'
        }

        failure {
            echo 'Deployment failed'
        }
    }
}