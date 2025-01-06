import React, { ReactElement } from "react"
import { useParams } from 'react-router-dom';
import {gql, useQuery} from "@apollo/client";

const GET_LIFT_USING_ID = gql`
    query GetLiftUsingId($getLiftUsingIdId: Int!) {
      getLiftUsingId(id: $getLiftUsingIdId) {
        date
        id 
        target_type
        moves {
            name
            target_muscle
        }
      }
    }
`

export const LiftPage: React.FC<unknown> = (): ReactElement => {
    const { id } = useParams()
    const { loading, error, data } = useQuery<{ getLiftUsingId: { date: Date, id: string, target_type: string, moves: { name: string, target_muscle: string}[]} }, { id: number }>(GET_LIFT_USING_ID, { variables: { id: parseInt(id ?? "1" ) }});
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error! {error.message}</div>
    return <div>
        Date: {data?.getLiftUsingId.date?.toString()}<br/>
        Target Type: {data?.getLiftUsingId.target_type}<br/>
        <table>
            <thead>
                <tr>
                    <td>Move</td>
                    <td>Num sets</td>
                    <td>Set Details</td>
                </tr>
            </thead>
            <tbody>
            {data?.getLiftUsingId.moves.map((move) => (
                <tr key={move.name}>
                    <td>{move.name}</td>
                    <td>{move.}</td>
                    <td>3x5</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
}