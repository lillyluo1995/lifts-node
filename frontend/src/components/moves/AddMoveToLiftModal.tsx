import React, { ReactElement, useRef, useState } from "react"
import Modal, { BaseModalProps } from "../shared/Modal"
import { useParams } from 'react-router-dom';
import {gql, useQuery, useMutation} from "@apollo/client";

const GET_ALL_MOVE_METADATA = gql`
    query GetMoveMetadata {
    getMoveMetadata {
        id
        name
        target_muscle
        }
    }
`

const ADD_MOVE_TO_LIFT = gql`
    mutation AddMoveToLift($input: AddMoveToLiftInput!) {
        addMoveToLift(input: $input) {
            success 
            message
        }
    }
`

const CREATE_MOVE_METADATA = gql`
    mutation CreateMoveMetadata($input: CreateMoveMetadataInput!) {
    createMoveMetadata(input: $input) {
            success
            message
            moveMetadata {
                id
            }
        }
    }
`

interface AddMoveToLiftProps extends BaseModalProps {
    moveIdsInLift: string[]
}

export const AddMoveToLift: React.FC<AddMoveToLiftProps> = (props): ReactElement => {
    const { id } = useParams()
    const { loading, error, data } = useQuery<{getMoveMetadata: {
            id: string, 
            target_muscle: string, 
            name: string
        }[]
    }> 
            (GET_ALL_MOVE_METADATA);

    const [addMoveToLift, _] = useMutation(ADD_MOVE_TO_LIFT); 
    const [addMoveMetadataCallback, addMoveMetadataData] = useMutation<{createMoveMetadata: 
        { 
            success: Boolean, 
            message: string, 
            moveMetadata: { 
                id: string 
            } 
        }
    }, { input: { name: string, target_muscle: string } }>(CREATE_MOVE_METADATA) 
    const [addMoveMetadataLoading, setAddMoveMetadataLoading] = useState<boolean>(false)

    const [newMoveMetadataName, setNewMoveMetadataname] = useState<string>("")
    const [newMoveTargetType, setNewMoveTargetType] = useState<string>("")

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error! {error.message}</div>

    const options = <table>
            <thead>
                <tr>
                    <td>Move</td>
                    <td>Target Muscle</td>
                    <td>Add Move</td>
                </tr>
            </thead>
            <tbody>
            {data?.getMoveMetadata.map((item) => {
                return <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.target_muscle}</td>
                    <td>{props.moveIdsInLift.includes(item.id) ? "✅" : <button 
                    onClick={
                        () => 
                        addMoveToLift({variables: { 
                            input: {
                                move_metadata_id: item.id,
                                lift_id: id
                            }}})
                    }
                    >Add Move</button>}</td>
                </tr>
            })}
            <tr>
                    <td>
                    <input placeholder={"New move..."} onChange={(event) => setNewMoveMetadataname(event.target.value)}>
                    </input>
                    </td>
                    <td>
                    <input placeholder={"Target muscle..."} onChange={(event) => setNewMoveTargetType(event.target.value)}>
                    </input>
                    </td>
                    <td>
                        {
                            <button
                            disabled={addMoveMetadataLoading || !newMoveMetadataName || !newMoveTargetType} 
                            onClick={
                                () => {
                                setAddMoveMetadataLoading(true)
                                addMoveMetadataCallback(
                                    {
                                        variables: {
                                            input: {
                                            name: newMoveMetadataName,
                                            target_muscle: newMoveTargetType
                                            }
                                        }
                                    }
                                ).then((response) => {
                                    addMoveToLift({variables: { 
                                        input: {
                                            move_metadata_id: response.data?.createMoveMetadata.moveMetadata.id,
                                            lift_id: id
                                        }
                                    }})
                                })
                            }
                            }>Create Move</button>
                        }
                        </td>
            </tr>
            </tbody>
        </table>

    return <Modal open={props.open} setIsOpen={props.setIsOpen} children={<div>{options}</div>}/>

}