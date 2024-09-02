import React from "react";

const images = require.context('../assets/artwork', true);

function Tile() {
    const name = "RFPF_Jacobs";
    const picture = images(`./${name}.svg`);
    return (
        <img src={picture}></img>
    )
}

export default Tile;