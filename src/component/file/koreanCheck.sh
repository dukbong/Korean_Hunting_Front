#!/bin/bash
echo "Checking whether Korean exists in this project ..."

function build_with_maven {
    mvn clean install
}

function build_with_gradle {
    ./gradlew clean build
}

function has_gradle_folder {
    [ -d ".gradle" ]
}

function build_project {
    if has_gradle_folder; then
        build_with_gradle
    else
        build_with_maven
    fi
}

current_date=$(date +%Y%m%d) 

# 현재 스크립트의 디렉토리 경로를 얻습니다.
current_dir=$(pwd) # C:\Korean_Hunting_Back
project_name=$(basename "$current_dir") # Korean_Hunting_Back

# 압축할 파일의 이름을 설정합니다.
zip_file="${project_name}_${current_date}.zip"

# 프로젝트 디렉토리 경로를 출력합니다.
echo "--------------------------------------------------"
echo "> Project Information"
echo "--------------------------------------------------"
echo "Project Directory: $current_dir"
echo "Project Name     : $project_name"
echo "Current Date     : $current_date"
echo "--------------------------------------------------"
echo

# 프로젝트를 압축하는 중임을 출력합니다.
echo "--------------------------------------------------"
echo "> Compressing project..."
echo "--------------------------------------------------"
zip -r "$current_dir/$zip_file" "$current_dir/src"
echo "--------------------------------------------------"
echo

echo "--------------------------------------------------"
echo "> Completing project Compression!!!"
echo "--------------------------------------------------"
echo

# API 서버로 POST 요청을 보냅니다.
#response=$(curl -X POST -F "file=@$current_dir/$zip_file" http://localhost:8088/api/upload)
response=0
# 압축 파일을 삭제합니다.
echo "--------------------------------------------------"
rm "$current_dir/$zip_file"
echo "Deleting compressed files..."
echo "--------------------------------------------------"
echo

echo "--------------------------------------------------"
echo "Deleted compressed files successfully!!!"
echo "--------------------------------------------------"
echo

# 응답을 출력합니다.
echo "--------------------------------------------------"
echo "Korean Check Result : "
echo "--------------------------------------------------"
echo "$response"
echo "Do you want to continue building? (Y/N)"
read -r input
echo "--------------------------------------------------"
echo
if [[ "$input" == "N" || "$input" == "n" ]]; then
    exit 0 
fi

if [[ "$response" == "0" ]]; then
   build_project

elif [[ "$response" == "1" ]]; then
   build_project
fi
