import React from "react";
import './App.css'

export const Dice = (props) => {

    const styles = {
        backgroundColor: props.isHeld ? "lightgreen" : ""
    }

    return (
        <div className="die" style={styles} onClick={props.holdDice} >
            <h2>{props.value}</h2>
        </div>
    )
}