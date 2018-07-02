#!/usr/bin/env bash

#$1 应用目录
#$2 部署环境，分为三种[test,prod,preprod,sgpprod]
#$3 部署域名
buildPath=$1
buildEnv=$2
buildDomain=$3
buildService=$4
buildNamespace=$5
BUILD_RELEASE_VERSION=v1.0


if [ "$buildEnv" = "test" ];then
     echo "init $buildEnv namespace "
     #镜像仓库命名空间
     REGISTRY_NAMESPACE="magicwindow"
     #镜像服务地址，采用阿里云VPC
     REGISTRY_HOST="registry-vpc.cn-hangzhou.aliyuncs.com"
elif [ "$buildEnv" = "cntest" ];then
     echo "init $buildEnv namespace "
     #镜像仓库命名空间
     REGISTRY_NAMESPACE="magicwindow"
     #镜像服务地址，采用阿里云VPC
     REGISTRY_HOST="registry-vpc.cn-hangzhou.aliyuncs.com"
elif [ "$buildEnv" = "cnprod" ];then
     echo "init $buildEnv namespace "
     #镜像仓库命名空间
     REGISTRY_NAMESPACE="magicwindow"
     #镜像服务地址，采用阿里云VPC
     REGISTRY_HOST="registry-vpc.cn-hangzhou.aliyuncs.com"
elif [ "$buildEnv" = "prod" ];then
     echo "init $buildEnv namespace "
     REGISTRY_NAMESPACE="mw-prod"
     #镜像服务地址，采用阿里云VPC
     REGISTRY_HOST="registry-intl.ap-southeast-3.aliyuncs.com"
elif [ "$buildEnv" = "sgpprod" ];then
     echo "init $buildEnv namespace "
     REGISTRY_NAMESPACE="mw-prod"
     #镜像服务地址，采用阿里云-新加坡-VPC
     REGISTRY_HOST="registry-intl-vpc.ap-southeast-1.aliyuncs.com"
else
     echo "no do init, REGISTRY_NAMESPACE is empty"
     REGISTRY_NAMESPACE=""
fi


#镜像仓库地址
REGISTRY_REPO="${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/${buildService}"

echo "镜像仓库是 is $REGISTRY_REPO"

#容器基础镜像
BASE_IMAGE="${REGISTRY_HOST}/${REGISTRY_NAMESPACE}/nginx:alpine"

echo "基础镜像是 $BASE_IMAGE"

#build time
NOW=$(date +"%Y%m%d%H%M%S")

function create_dockerfile(){

echo "创建dockerfile "
cat <<EOF >${buildPath}/Dockerfile
FROM ${BASE_IMAGE}

WORKDIR /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf
COPY . .

RUN ls -al

EOF

}



function docker_build(){
    echo "docker build start: ${REGISTRY_REPO}:${BUILD_RELEASE_VERSION}.${NOW} "

    docker build -t "${REGISTRY_REPO}:${BUILD_RELEASE_VERSION}.${NOW}" ${buildPath}/.
    docker push  "${REGISTRY_REPO}:${BUILD_RELEASE_VERSION}.${NOW}"
    docker rmi -f "${REGISTRY_REPO}:${BUILD_RELEASE_VERSION}.${NOW}"

    echo "docker build finish"
}


function create_helm_value(){
 echo "创建helm value.yaml "

cat <<EOF >${buildPath}/values.yaml
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.
replicaCount: 1
image:
  repository: ${REGISTRY_REPO}
  tag: ${BUILD_RELEASE_VERSION}.${NOW}
  imagePullSecrets: regsecret
  pullPolicy: IfNotPresent
service:
  name: server
  type: ClusterIP
  externalPort: 20081
  internalPort: 20081
ingress:
  enabled: true
  # Used to create an Ingress record.
  hosts:
    - ${buildDomain}
  annotations:
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  tls:
    # Secrets must be manually created in the namespace.
    # - secretName: chart-example-tls
    #   hosts:
    #     - chart-example.local
resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi
EOF

echo "创建helm value.yaml finish"

}

function helm_release(){
    echo "del ${buildService}  release "
    helm del     --purge   ${buildService}

    echo "build path1 $(pwd)"

    cd ${buildPath}

    echo "build path2 $(pwd)"
    cp -f ${buildPath}/values.yaml ${buildPath}/chart/values.yaml

    echo "install chart ..."
    helm install --namespace ${buildNamespace} --name ${buildService} $(pwd)/chart
}

create_dockerfile

docker_build

create_helm_value

helm_release


echo "helm finish to k8s"
