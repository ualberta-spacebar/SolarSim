function newObjectControl(planet) {
    var dock = document.getElementById("game_objects");
    // console.log(dock);

    //declare elements
    let obj = document.createElement("div");
    obj.className = "object";
    let l = document.createElement("label");
    l.innerText = "► Planet " + planet.label;
    l.id = planet.label;
    let ul = document.createElement("ul");
    ul.style.display = "none"
    ul.id = "characteristics";
    let para = [`Mass (×10<sup>16</sup> kg) <input type='number' name='${planet.label}' value='${planet.mass/1e16}'>`, `Color <input type='color' name='${planet.label}' value='${planet.colour}'>`];
    for (let p of para) {
        let li = document.createElement("li");
        li.innerHTML = p;
        ul.appendChild(li);
    }

    // add all the stuff to html
    obj.appendChild(l);
    // obj.appendChild(cb);
    obj.appendChild(ul);
    dock.appendChild(obj);
}

function toggling() {
    $(".object label").click(function () {
        let t = $(this)[0].innerText;
        if (t[0] == "▼") {
            $(this)[0].innerText = "►" + t.substring(1);
            try {
                get_planet($(this)[0].id).highlighted = false;
            } catch(err) {}
        } else {
            $(this)[0].innerText = "▼" + t.substring(1);
            try {
                get_planet($(this)[0].id).highlighted = true;
            } catch(err) {}
        }
        $(" ~ #characteristics", this).slideToggle();
    });

    // settings
    $(".object #mass").change(function () {
        get_planet($(this).name).mass = $(this).value;
        console.table(get_planet($(this).id));
    });
    
    $(".object #color").change(function () {
        get_planet($(this).name).mass = $(this).value * 1e16;
        console.log(get_planet($(this).id));
    });
}

$(document).ready(function () {
    toggling();
    // sun values
    let mass_factor = 1e28;
    $("#sun #mass input")[0].value = Math.round(sun.mass / mass_factor);    // set value
    $("#sun #mass input").change(function () {      // on change do this
        sun.mass = parseInt(this.value, 10) * mass_factor;
    });

    $("#sun #temp input")[0].value = Math.round(sun.temperature);   // set value
    $("#sun #temp input").change(function () {      // on change do this
        sun.temperature = parseInt(this.value, 10);
    });

    $(".overlay h2").click(function () {
        $(".game_settings").slideToggle("slow");
    });
});