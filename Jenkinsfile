pipeline {
  agent any
  tools { git 'Default' }

  environment {
    COMPOSE_PROJECT_NAME = 'inkas'
    PATH = "/usr/local/bin:/usr/bin:${env.PATH}"
  }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
      }
    }

    stage('Build & Deploy') {
      steps {
        script {
          echo "Deteniendo y eliminando el contenedor frontend anterior (si existe)…"
          sh "docker-compose -p ${COMPOSE_PROJECT_NAME} -f docker-compose.yml rm -sf frontend || true"

          echo "Reconstruyendo y desplegando frontend…"
          sh "docker-compose -p ${COMPOSE_PROJECT_NAME} -f docker-compose.yml up -d --build --no-deps frontend"

          echo "Estado actual de los contenedores frontend:"
          sh "docker-compose -p ${COMPOSE_PROJECT_NAME} -f docker-compose.yml ps frontend"
        }
      }
    }
  }

  post {
    always {
      echo "Build #${env.BUILD_NUMBER} → ${currentBuild.currentResult}"
      sh "docker image prune -f"
    }
    success {
      /*script {
        try {
          mail to:      'juanite.dev@gmail.com',
               subject: "[Jenkins] #${env.BUILD_NUMBER} ${env.JOB_NAME} (SUCCESS)",
               body:    "Detalles: ${env.BUILD_URL}"
        } catch (e) {
          echo "Error enviando correo: ${e.message}"
        }
      }*/
      echo "¡El pipeline se ha completado con exito!"
    }
    failure {
      echo "¡Ha fallado el pipeline!"
    }
  }
}