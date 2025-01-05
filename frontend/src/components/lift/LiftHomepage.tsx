import { ReactElement } from "react"
import { useQuery, gql } from "@apollo/client"

const GET_LIFTS = gql`
    query GetLifts {
        getLifts {
            date 
            target_type 
        }
    }
`

export const LiftHomepage: React.FC<unknown> = (): ReactElement => {
    const { loading, error, data } = useQuery<{ getLifts: { date: Date, target_type: string}[]}>(GET_LIFTS);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error! {error.message}</p>

    return <table>
        <thead>
            <tr>
            <td>Date</td>
            <td>Lift Type</td>
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
                </tr>
            ))
        }
        </tbody>
    </table>
}