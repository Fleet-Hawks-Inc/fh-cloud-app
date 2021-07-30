#!/usr/bin/env groovy
import groovy.json.JsonSlurperClassic
import groovy.json.JsonOutput

def codeBuildOutput
pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
    timeout(time: 1, unit: 'HOURS')
    timestamps()
  }
  environment {
    AWS_ECR_REGION_DEV = 'ap-south-1'
    AWS_ECS_CLUSTER_DEV = 'fh-dev-cluster'
    AWS_CODE_BUILD_PROJECT_DEV = 'fleet-manager-application'
    AWS_ECS_SERVICE_DEV = 'fleet-manager-application'
    AWS_ECS_TASK_DEFINITION_DEV = 'fleet-manager-application'
    AWS_ECS_NEW_TASK_DEFINITION = './ecs/fleet-manager-application/new_task_definition.json'
    AWS_ECR_REGION_PREPROD = 'us-east-2'
    AWS_ECS_CLUSTER_PREPROD = 'fh-non-prod-cluster'
    AWS_CODE_BUILD_PROJECT_PREPROD = 'fleet-manager-application'
    AWS_ECS_SERVICE_PREPROD = 'fleet-manager-application'
    AWS_ECS_TASK_DEFINITION_PREPROD = 'task-def-fleet-manager-dashboard'  
  }

  stages {
    stage('Lint & Build') {
      steps {
        nodejs(nodeJSInstallationName: 'nodejs12x') {
          sh 'npm install'
        }
      }
    }
    
    // Build Stage for DEV
    stage('DEV: Build Docker Image') {
      when {
        branch 'develop'  
      }
      steps {
        script {
          codeBuildOutput = awsCodeBuild credentialsId: 'aws-code-build-groovy',
            credentialsType: 'jenkins', projectName: "${AWS_ECS_SERVICE_DEV}",
          region: AWS_ECR_REGION_DEV, sourceControlType: 'project'

          echo(codeBuildOutput.getBuildId())
        }
      }
    }
    
    // Build Stage for PRE-PROD
    stage('PREPROD: Build Docker Image') {
      when {
        branch 'master'  
      }
      steps {
        script {
          codeBuildOutput = awsCodeBuild credentialsId: 'aws-code-build-groovy',
            credentialsType: 'jenkins', projectName: "${AWS_ECS_SERVICE_PREPROD}",
          region: AWS_ECR_REGION_PREPROD, sourceControlType: 'project'

          echo(codeBuildOutput.getBuildId())
        }
      }  
    }
    
    // Deploy in DEV
    stage('Dev: Deployment') {
      when {
        branch 'develop'
      }
      steps {
        script {
          String[] buildId =  codeBuildOutput.getBuildId().split(':')
          String latestImageVersionTag = 'build-' + buildId[1]
          def taskRevision = sh(script: "aws ecs describe-task-definition --task-definition ${AWS_ECS_TASK_DEFINITION_DEV} --region ${AWS_ECR_REGION_DEV}", returnStdout: true)
          def taskRevisionDefinition = new JsonSlurperClassic().parseText(taskRevision)
          String[] dockerImagePath = taskRevisionDefinition.taskDefinition.containerDefinitions[0].image.split(':')
          echo(taskRevision)
          String latestImageVersion = dockerImagePath[0] + ':' + latestImageVersionTag
          println('Latest Image Version: ' + latestImageVersion)

          // Remove unwanted property for register task definiton CLI
          taskRevisionDefinition.taskDefinition.remove('taskDefinitionArn')
          taskRevisionDefinition.taskDefinition.remove('revision')
          taskRevisionDefinition.taskDefinition.remove('status')
          taskRevisionDefinition.taskDefinition.remove('requiresAttributes')
          taskRevisionDefinition.taskDefinition.remove('compatibilities')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('volumesFrom')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('cpu')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('secrets')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('command')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('systemControls')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('mountPoints')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('links')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('entryPoint')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dnsServers')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dockerLabels')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('environment')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('ulimits')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('extraHosts')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dockerSecurityOptions')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('environmentFiles')

          updateFile(JsonOutput.toJson(taskRevisionDefinition.taskDefinition))

          sh("cat ${AWS_ECS_NEW_TASK_DEFINITION}")
          def newTaskRevision = sh(script: "aws ecs register-task-definition --family ${AWS_ECS_TASK_DEFINITION_DEV} --region ${AWS_ECR_REGION_DEV} --cli-input-json file://${AWS_ECS_NEW_TASK_DEFINITION}", returnStdout: true)
          println('New Task Registered Successfully: ' + newTaskRevision)

          println('Updating Service with new version of Task Definition')
          def udpatedTaskDefinition = new JsonSlurperClassic().parseText(newTaskRevision)

          def updateService = sh(script: "aws ecs update-service --cluster ${AWS_ECS_CLUSTER_DEV} --service ${AWS_ECS_SERVICE_DEV} --region ${AWS_ECR_REGION_DEV} --task-definition ${AWS_ECS_TASK_DEFINITION_DEV}:${udpatedTaskDefinition.taskDefinition.revision}", returnStdout: true)
          println("Task Updated Successfully ${updateService} ")
        }
      }
    }
    
    // Deploy in PRE-PROD
    stage('PREPROD: Deployment') {
      when {
        branch 'master'    
      }
      steps {
        script {
          String[] buildId =  codeBuildOutput.getBuildId().split(':')
          String latestImageVersionTag = 'build-' + buildId[1]
          def taskRevision = sh(script: "aws ecs describe-task-definition --task-definition ${AWS_ECS_TASK_DEFINITION_PREPROD} --region ${AWS_ECR_REGION_PREPROD}", returnStdout: true)
          def taskRevisionDefinition = new JsonSlurperClassic().parseText(taskRevision)
          String[] dockerImagePath = taskRevisionDefinition.taskDefinition.containerDefinitions[0].image.split(':')
          echo(taskRevision)
          String latestImageVersion = dockerImagePath[0] + ':' + latestImageVersionTag
          println('Latest Image Version: ' + latestImageVersion)

          // Remove unwanted property for register task definiton CLI
          taskRevisionDefinition.taskDefinition.remove('taskDefinitionArn')
          taskRevisionDefinition.taskDefinition.remove('revision')
          taskRevisionDefinition.taskDefinition.remove('status')
          taskRevisionDefinition.taskDefinition.remove('requiresAttributes')
          taskRevisionDefinition.taskDefinition.remove('compatibilities')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('volumesFrom')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('cpu')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('secrets')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('command')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('systemControls')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('mountPoints')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('links')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('entryPoint')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dnsServers')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dockerLabels')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('environment')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('ulimits')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('extraHosts')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('dockerSecurityOptions')
          taskRevisionDefinition.taskDefinition.containerDefinitions.remove('environmentFiles')

          updateFile(JsonOutput.toJson(taskRevisionDefinition.taskDefinition))

          sh("cat ${AWS_ECS_NEW_TASK_DEFINITION}")
          def newTaskRevision = sh(script: "aws ecs register-task-definition --family ${AWS_ECS_TASK_DEFINITION_PREPROD} --region ${AWS_ECR_REGION_PREPROD} --cli-input-json file://${AWS_ECS_NEW_TASK_DEFINITION}", returnStdout: true)
          println('New Task Registered Successfully: ' + newTaskRevision)

          println('Updating Service with new version of Task Definition')
          def udpatedTaskDefinition = new JsonSlurperClassic().parseText(newTaskRevision)

          def updateService = sh(script: "aws ecs update-service --cluster ${AWS_ECS_CLUSTER_PREPROD} --service ${AWS_ECS_SERVICE_PREPROD} --region ${AWS_ECR_REGION_PREPROD} --task-definition ${AWS_ECS_TASK_DEFINITION_PREPROD}:${udpatedTaskDefinition.taskDefinition.revision}", returnStdout: true)
          println("Task Updated Successfully ${updateService} ")
        }    
      } 
    }
     // Verify For DEV
    stage('DEV: Verify Service') {
      when {
        branch 'develop'
      }
      steps {
        script {
          println('Checking Service deployment status........')
          def taskStatus = sh(script: "aws ecs wait services-stable --cluster ${AWS_ECS_CLUSTER_DEV} --services ${AWS_ECS_SERVICE_DEV} --region ${AWS_ECR_REGION_DEV}", returnStdout: true)
          println("Task status ${taskStatus}")
        }
      }
    }
    
    // Verify For PRE-PROD
    stage('PREPROD: Verify Service') {
      when {
        branch 'master'
      }
      steps {
        script {
          println('Checking Service deployment status........')
          def taskStatus = sh(script: "aws ecs wait services-stable --cluster ${AWS_ECS_CLUSTER_PREPROD} --services ${AWS_ECS_SERVICE_PREPROD} --region ${AWS_ECR_REGION_PREPROD}", returnStdout: true)
          println("Task status ${taskStatus}")
        }
      }
    }
  } 
}

def updateFile(contents) {
  writeJSON file:AWS_ECS_NEW_TASK_DEFINITION, json: contents
}
