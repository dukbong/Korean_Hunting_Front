import React from 'react';
import './css/openapi.css'
import axiosInstance from "./apiIntercepter";

const OpenApi = () => {

    const handleDownload = () => {
        const token = localStorage.getItem("token");

        axiosInstance.get("/getfile", {
            headers:{
                Authorization : `Bearer ${token}`
            },
        })
        .then((res) => {
            console.log(res);
            const binaryString = atob(res.data.message);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
            bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/octet-stream' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "source_code_io.zip";
            link.click();
        });
    }


    return (
        <div className='builder-main'>
            <div className='builder'>
                <h1>Korean Check Builder</h1>
                <p>You can select build after checking whether Hangul exists inside the project.</p>
                <p>After downloading the <button className='download-button' onClick={handleDownload}>shell script package</button>, place it in the root folder of the project!</p>
                <p>The functionality in question is chained to Gradle <strong>build</strong> and Maven <strong>install</strong>.</p>
            </div>
            <div className='content'>
                <div className='gradle'>
                    <h1>[Gradle] Build Custom</h1>
                    <p>Please write it at the bottom of the build.gradle file.</p>
                    <pre>
                        <code>
                            {"\n"}
                            task koreanCheck(type: Exec)&#123;{"\n"}
                            &emsp;&emsp;&emsp;&emsp;commandLine 'sh', './sourcode_io/koreanCheck.sh'{"\n"}
                            &emsp;&emsp;&emsp;&emsp;standardInput = System.in{"\n"}
                            &#125;{"\n"}{"\n"}
                            tasks.build.dependsOn customTask{"\n"}
                            &emsp;
                        </code>
                    </pre>
                </div>

                <div className='maven'>
                    <h1>[Maven] Build Custom</h1>
                    <p>Please put it in the build section of the pom.xml file.</p>
                    <pre>
                        <code>
                        &lt;plugin&gt;{"\n"}
                        &emsp;&emsp;&lt;groupId&gt;org.codehaus.mojo&lt;/groupId&gt;{"\n"}
                        &emsp;&emsp;&lt;artifactId&gt;exec-maven-plugin&lt;/artifactId&gt;{"\n"}
                        &emsp;&emsp;&lt;version&gt;3.0.0&lt;/version&gt;{"\n"}
                        &emsp;&emsp;&lt;executions&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&lt;execution&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;id&gt;customTask&lt;/id&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;phase&gt;validate&lt;/phase&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;goals&gt;&emsp;&lt;goal&gt;exec&lt;/goal&gt;&emsp;&lt;/goals&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;configuration&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;executable&gt;sh&lt;/executable&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;workingDirectory&gt;$&#123;project.basedir&#125;/sourcode_io&lt;/workingDirectory&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;arguments&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;argument&gt;koreanCheck.sh&lt;/argument&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;/arguments&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;/configuration&gt;{"\n"}
                        &emsp;&emsp;&emsp;&emsp;&lt;/execution&gt;{"\n"}
                        &emsp;&emsp;&lt;/executions&gt;{"\n"}
                        &lt;/plugin&gt;
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default OpenApi;