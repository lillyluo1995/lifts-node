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
    const { loading, error, data } = useQuery<{getLiftUsingId: {
        date: string, 
        id: string, 
        target_type: string, moves: {
        move_metadata: {
            name: string, target_muscle: string 
        }, sets: {
            set_count: number,
            num_reps: number,
            weight_lbs: number,
            unilateral: boolean
        }[]
    }[]
}}> 
        (GET_LIFT_USING_ID, {  variables: { id: id ? parseInt(id) : "2" }});
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error! {error.message}</div>
    return (<div>
      <div>Date: {data?.getLiftUsingId.date?.toString()}</div>
      <div>Target Type: {data?.getLiftUsingId.target_type}</div>
      <br/>
            {data?.getLiftUsingId.moves.map((move) => {
                return <div>
                    <div>Move: {move.move_metadata.name}</div>
                    <div>Type: {move.move_metadata.target_muscle}</div>
                    <table>
                    <thead>
                        <tr>
                            <td>Set Count</td>
                            <td># Reps</td>
                            <td>Weight (lbs)</td>
                            <td>Unilateral</td>
                        </tr>
                    </thead>
                    <tbody>
                    {move.sets.map((set) => (
                        <tr key={`${move.move_metadata.name}_${set.set_count}`}>
                            <td>{set.set_count}</td>
                            <td>{set.num_reps}</td>
                            <td>{set.weight_lbs}</td>
                            <td>{set.unilateral.toString()}</td>
                        </tr>
            ))}
            </tbody>
                </table>
                </div>
            })}
    </div>
    )
}