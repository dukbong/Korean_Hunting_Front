import React, { useState } from "react";
import './css/openapi.css'
import axiosInstance from "./apiIntercepter";

const OpenApi = () => {
    const [activeTab, setActiveTab] = useState('builder');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
        <div className='Open-container'>
            <div className='Open-left'>
                <div className={`Open-tab ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => handleTabClick('builder')}>
                    Over View
                </div>
                <div className={`Open-tab ${activeTab === 'gradle' ? 'active' : ''}`} onClick={() => handleTabClick('gradle')}>
                    Gradle Custom Ex
                </div>
                <div className={`Open-tab ${activeTab === 'maven' ? 'active' : ''}`} onClick={() => handleTabClick('maven')}>
                    Maven Custom Ex
                </div>
            </div>
            <div className='Open-right'>
                {activeTab === 'builder' && (
                    <div className='Open-builder'>
                        <h1>Korean Check Builder</h1>
                        <p>After downloading the <button className='Open-download-button' onClick={handleDownload}>Shell Script Package</button>, you can freely customize and use the build as you wish.</p>
                        <p>Additionally, when using this Shell Script Package for customization,
                        you can always check the <strong>project name</strong>, <strong>build time</strong>, and the presence of <strong>korean characters</strong> in the source code on the website.</p>
                        <p>If you are unsure how to customize the project management tool, you can simply follow the simple customization example provided next to it.</p>
                        <p>Instructions on how to use the Shell Script Package can be found in the <strong>README.txt</strong> file included in the downloaded zip file.</p>
                        <p>Additionally, to utilize the Shell Script Package, it is essential to obtain a personal <strong>API authentication key</strong>.</p>
                        <p>You can download your personal API authentication key by clicking on your login ID in the top right corner.</p>
                    </div>
                )}
                {activeTab === 'gradle' && (
                    <div className='Open-gradle'>
                        <h1>Build Custom</h1>
                        <p>The following code is a simple example that executes a ShellScript before the Gradle build:</p>
                        <div className='Open-gradle-code'>
                            <pre>
                                <code>
                                
                                    task koreanCheck(type: Exec)&#123;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;commandLine 'sh', './sourcode_io/koreanCheck.sh', project.name{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;standardInput = System.in{"\n"}
                                    &#125;{"\n"}{"\n"}
                                    tasks.build.dependsOn customTask
                            
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
                {activeTab === 'maven' && (
                    <div className='Open-maven'>
                        <h1>Install Custom</h1>
                        <p>The following code is a simple example that executes a ShellScript before the Maven Install:</p>
                        <div className='Open-maven-code'>
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
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;goals&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;goal&gt;exec&lt;/goal&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;/goals&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;configuration&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;executable&gt;sh&lt;/executable&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;workingDirectory&gt;$&#123;project.basedir&#125;/sourcecode_io&lt;/workingDirectory&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;arguments&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;argument&gt;koreanCheck.sh&lt;/argument&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;argument&gt;$&#123;project.name&#125;&lt;/argument&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;/arguments&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&lt;/configuration&gt;{"\n"}
                                    &emsp;&emsp;&emsp;&emsp;&lt;/execution&gt;{"\n"}
                                    &emsp;&emsp;&lt;/executions&gt;{"\n"}
                                    &lt;/plugin&gt;
                                </code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OpenApi;
