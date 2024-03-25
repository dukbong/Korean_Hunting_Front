import React from 'react';
import './css/openapi.css'

const OpenApi = () => {

    const handleDownload = () => {
        const filePath = "./file/koreanCheck.sh";
        const link = document.createElement('a');
        link.href = filePath;
        link.download = 'test.sh';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    return (
        <div className='builder-main'>
            <div className='builder'>
                <h1>Korean Check Builder</h1>
                <p>You can select build after checking whether Hangul exists inside the project.</p>
                <p>After downloading the <a href="" onClick={handleDownload}>shell script</a>, place it in the root folder of the project!</p>
                <p>The shell script to be executed includes “clean” and “build”.</p>
            </div>
            <div className='content'>
                <div className='gradle'>
                    <h1>[Gradle] Build Custom</h1>
                    <pre>
                        <code>
                            task koreanCheck &#123;{"\n"}
                            &emsp;&emsp;doLast &#123;{"\n"}
                            &emsp;&emsp;&emsp;&emsp;exec &#123;{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;commandLine 'sh', './koreanCheck.sh'{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;standardInput = System.in{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&#125;{"\n"}
                            &emsp;&emsp;&#125;{"\n"}
                            &#125;
                        </code>
                    </pre>

                    <h1>Example</h1>
                    <p className='example'>./gradlew koreanCheck</p>
                </div>
                <div className='maven'>
                    <h1>[Maven] Build Custom</h1>
                    <pre>
                        <code>
                            task koreanCheck &#123;{"\n"}
                            &emsp;&emsp;doLast &#123;{"\n"}
                            &emsp;&emsp;&emsp;&emsp;exec &#123;{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;commandLine 'sh', './koreanCheck.sh'{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;standardInput = System.in{"\n"}
                            &emsp;&emsp;&emsp;&emsp;&#125;{"\n"}
                            &emsp;&emsp;&#125;{"\n"}
                            &#125;
                        </code>
                    </pre>

                    <h1>Example</h1>
                    <p className='example'>./gradlew koreanCheck</p>
                </div>
            </div>
        </div>
    )
}

export default OpenApi;