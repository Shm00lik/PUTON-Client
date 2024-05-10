import { useEffect, useState } from "react";
import { Client } from "../../utils/Protocol";

const Ping = () => {
    const [latency, setLatency] = useState(0);
    const [latencies, setLatencies] = useState<number[]>([]);

    useEffect(() => {
        const runThis = async () => {
            let start = new Date();
            let result = await Client.getInstance().request("/ping", "POST");
            let end = new Date(Number(result.now) * 1000);

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
