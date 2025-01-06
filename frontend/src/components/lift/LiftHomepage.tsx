import React, { ReactElement } from "react"
import { useQuery, gql } from "@apollo/client"
import { Link } from 'react-router-dom';

const GET_LIFTS = gql`
    query GetLifts {
        getLifts {
            id
            date 
            target_type 
        }
    }
`

export const LiftHomepage: React.FC<unknown> = (): ReactElement => {
    const { loading, error, data } = useQuery<{ getLifts: { id: string, date: Date, target_type: string}[]}>(GET_LIFTS);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error! {error.message}</p>

    return <table>
        <thead>
            <tr>
            <td>Date</td>
            <td>Lift Type</td>
            <td>Details</td>
            </tr>
        </thead>
        <tbody>
        {
            data?.getLifts.map((lift) => (
                <tr key={lift.date.toString()}>
                    <td>
                        {`${lift.date}`}
                    </td>
                    <td>
                        {`${lift.target_type}`}
                    </td>
                    <td>
                        <Link to={`/lift/${lift.id}`}><button>Details</button></Link>;
                    </td>
                </tr>
            ))
        }
        </tbody>
    </table>
}