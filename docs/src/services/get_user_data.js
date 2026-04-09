import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/get_utm';


class get_user_data {
    get_user_data(user_id) {    
        return axios.get(`${API_URL}/${user_id}`);
        
    }
}

export default new get_user_data();





        //   <tbody>
        //     {utmArchive.map(row => (
        //       <tr key={row.id}>
        //         <td>{row.id}</td>
        //         <td>{row.url}</td>
        //         <td>{row.utm_source.join(", ")}</td>
        //         <td>{row.utm_medium.join(", ")}</td>
        //         <td>{row.utm_content.join(", ")}</td>
        //         <td>{row.utm_term.join(", ")}</td>
        //         <td>{row.utm_campaign}</td>
        //         <td style={{ display:"flex", gap:"0.5rem" }}>
        //           <input type="text" value={row.generatedURL} readOnly style={{ flex: 1 }} />
        //           <button onClick={() => copyToClipboard(row.generatedURL)}>📎</button>
        //         </td>
        //         <td>{row.date}</td>
        //         <td>
        //           <button onClick={() => removeArchiveRow(row.id)}>×</button>
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>