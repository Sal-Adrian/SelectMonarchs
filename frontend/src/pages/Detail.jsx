import {useParams} from "react-router-dom";
import BetDetail from '../components/BetDetail';
import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

function Detail() {
    const {bet_id} = useParams();
    const [bet, setBet] = useState(null);

    useEffect(() => {
        (async () => {
            await api.get(`/bookies/${bet_id}/`)
            .then((res) => res.data)
            .then((data) => {
                setBet(data);
            })
            .catch((err) => alert(err));;
        })();
    }, []);

    return (
        <div>
            <Navbar />
            {bet && <BetDetail bet={bet} />}
        </div>
    )
}

export default Detail;