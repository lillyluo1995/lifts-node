import React, {ReactElement} from "react";
import Modal, { BaseModalProps } from "../shared/Modal"

interface AddSetModalProps extends BaseModalProps {
    lastSet: {
        set_count: number 
        num_reps: number 
        weight_lbs: number 
        unilateral: boolean 
    } | null
    moveMetadata: {
        id: string 
    } | null
}



export const AddSetModal: React.FC<AddSetModalProps> = (props): ReactElement => {
    const child = <div>
        <table>
            <tbody>
                <tr>
                    <td>Set Count</td>
                    <td>{props.lastSet?.set_count ? props.lastSet.set_count + 1 : 1}</td>
                </tr>
                <tr>
                    <td>Weight (lbs)</td>
                    <td>{props.lastSet?.weight_lbs ?? 100}</td>
                </tr>
                <tr>
                    <td>Num Reps</td>
                    <td>{props.lastSet?.num_reps ?? 10}</td>
                </tr>
                <tr>
                    <td>Unilateral</td>
                    <td>{`${props.lastSet?.unilateral ?? false}`}</td>
                </tr>
            </tbody>

        </table>

    </div>


    return <Modal open={props.open} setIsOpen={props.setIsOpen} children={<div>{child}</div>}/>
}