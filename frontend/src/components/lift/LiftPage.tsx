import React, { ReactElement } from "react"
import { useParams } from 'react-router-dom';
import {gql, useQuery} from "@apollo/client";

const GET_LIFT_USING_ID = gql`
    query GetLiftUsingId($id: Int!) {
      getLiftUsingId(id: $id) {
        date
        id 
        target_type
        moves {
            move_metadata {
                name 
                target_muscle
            }
            sets {
                set_count
                num_reps
                weight_lbs
                unilateral
            }
        }
      }
    }
`

export const LiftPage: React.FC = (): ReactElement => {
    const { id } = useParams()
    const { loading, error, data } = useQuery(GET_LIFT_USING_ID, {  variables: { id: id ? parseInt(id) : "2" }});
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error! {error.message}</div>
    return (<div>
      <div>Date: {data?.getLiftUsingId.date?.toString()}</div>
      <div>Target Type: {data?.getLiftUsingId.target_type}</div>
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
                    <td>{move.move_metadata.name}</td>
                    <td>3x5</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    )
}