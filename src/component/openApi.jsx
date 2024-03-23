import React from 'react';

const OpenApi = () => {
    return (
        <div>
            <h1>API</h1>
            <p>Open API is used to obtain results used by users in JSON format.</p>

            <h1>API Access Method</h1>
            <p><span>GET</span> <span>/api/list?seq=:seq:</span></p>

            <table>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td>seq</td>
                    <td>number</td>
                    <td>The seq "The 'seq' denotes the sequence number of the desired attachment file (default : recent number)</td>
                </tr>
            </table>
        </div>
    )
}

export default OpenApi;