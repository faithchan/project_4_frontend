import React, { useState } from 'react'
import TradeCard from '../components/TradeCard'
import DeleteNFTModal from '../components/DeleteNFTModal'

const trades = () => {
    const[deleteModal, setDeleteModal]= useState(false)
    return (
        <div className="">
            {deleteModal?<DeleteNFTModal deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>:""}
            <div className="flex flex-wrap gap-10 justify-center my-20 mx-32">
            <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
            <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
            <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
            <TradeCard deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
            </div>
        </div>
    )
}

export default trades
