import type { ReactNode } from "react";

interface Props {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export default function Table({headers, children, className}: Props) {
    return (
        <table className={`tbl${className ? ` ${className}` : ""}`}>
            <thead>
                <tr>
                    {headers.map((h) => (
                        <th key={h}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    );
}