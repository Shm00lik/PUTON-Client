import { useEffect, useState } from "react";
import { Client, LoginData, Response } from "../../utils/Protocol";

const Ping = () => {
    const [latency, setLatency] = useState(0);
    const [latencies, setLatencies] = useState<number[]>([]);

    useEffect(() => {
        const runThis = async () => {
            let start = new Date();
            let result: Response = await Client.ping();
            let end = new Date(Number(result.body.message) * 1000);

            setLatency(end.getTime() - start.getTime());
            setLatencies([...latencies, end.getTime() - start.getTime()]);
        };

        runThis();
    });

    return (
        <>
            <h1>{latencies.reduce((p, c) => p + c, 0) / latencies.length}</h1>
            <h2>{latencies.join("\n ")}</h2>
        </>
    );
};

export default Ping;
