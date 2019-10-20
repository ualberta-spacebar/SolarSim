function newObjectControl(id) {
    var dock = document.getElementById("game_objects");
    // console.log(dock);

    //declare elements
    let obj = document.createElement("div");
    obj.className = "object";
    let l = document.createElement("label");
    l.innerText = "► Planet " + id;
    // let cb = document.createElement("input")
    // cb.type = "checkbox";
    let ul = document.createElement("ul");
    ul.style.display = "none"
    ul.id = "characteristics";
    let para = ["Mass (kg) <input type='number'>", "Color <input type='color'>"];
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

$(document).ready(function () {
    for (let i = 1; i <= 3; i++) {
        newObjectControl(i);
    }

    $(".object label").click(function () {
        let t = $(this)[0].innerText;
        if (t[0] == "▼") {
            $(this)[0].innerText = "►" + t.substring(1);
        } else {
            $(this)[0].innerText = "▼" + t.substring(1);
        }
        $(" ~ #characteristics", this).slideToggle();
    });

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
