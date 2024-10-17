import axios from 'axios';
export function getPoinType() {
    axios.get('http://localhost:5000/bigquery')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error('Error fetching BigQuery data:', error);
            return ('Error fetching BigQuery data:', error);
        });
}

export function getCrewList() {
    axios.get('http://localhost:5000/allCrewList')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error('Error fetching BigQuery data:', error);
            return ('Error fetching BigQuery data:', error);
        });
}