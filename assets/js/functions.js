//jshint esversion: 6

var settings = {

    cutoff: 200,
    shift: 0,
    synth: "piano",
    speed_multiplier: 1,
    bitbot_dance: false

};

if (!(window.File && window.FileReader && window.FileList && window.Blob)) {

    document.querySelector(".top p").textContent = "Reading files not supported by this browser";

} else {

    var drop = document.querySelector(".top");
    var input = document.querySelector(".top input");

    drop.addEventListener("dragenter", function() {
        drop.classList.add("hover");
    });

    drop.addEventListener("dragleave", function() {
        drop.classList.remove("hover");
    });

    drop.addEventListener("drop", function() {
        drop.classList.remove("hover");
    });

    input.addEventListener("change", function(e) {

        var files = e.target.files;
        if (files.length > 0) {
            var file = files[0];
            document.querySelector(".top p").textContent = file.name;
            parseFile(file);
        }
    });

}

function parseData(data) {

    all = data;
    track_num = 1;

    data = data.tracks[track_num];

    data = data.notes;

    answer = "";

    if (settings.cutoff == "false") {

        cutoff = data.length;

    } else {

        cutoff = settings.cutoff;

    }

    for (var i = 0; i < cutoff; i++) {

        let frequency = Math.round(Math.pow(2, (data[i].midi - 69) / (12)) * 440);
        let duration = Math.round(data[i].duration * 1000);

        if (!settings.bitbot_dance) {

            answer += `music.playTone(${frequency}, ${duration})\n`;

        } else {

            if(i % 2 == 0) {
                answer += `bitbot.motor(BBMotor.All, 255)\n`;
                answer += `bitbot.neoRainbow()\n`;
            } else {
                answer += `bitbot.motor(BBMotor.All, -255)\n`;
                answer += `bitbot.neoClear()\n`;
            }

            answer += `music.playTone(${frequency}, ${duration})\n`;

        }

    }

    return answer;

}

function parseFile(file) {
    //read the file
    var reader = new FileReader();
    reader.onload = function(e) {

        var partsData = MidiConvert.parse(e.target.result);
        console.log(partsData);
        var result = parseData(partsData);
        document.querySelector(".result").innerHTML = result;

    };

    reader.readAsBinaryString(file);
}

var copy_textarea = document.querySelector(".copy");

copy_textarea.addEventListener('click', function(e) {
    var code = document.querySelector('.result');
    code.select();


    try {

        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';

    } catch (err) {

        alert('Oops, unable to copy – Click on the text and then press Ctrl-A then Ctrl C.');

    }

    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
});

var bitbot_toggle = document.getElementsByClassName("bitbot")[0];

bitbot_toggle.addEventListener("click", function(e) {

    if (bitbot_toggle.classList.contains('not-activated')) {

        bitbot_toggle.classList.remove("not-activated");
        bitbot_toggle.classList.add("activated");

        settings.bitbot_dance = true;

        bitbot_toggle.innerHTML = "Add BitBot dance: Yes";

    } else if (bitbot_toggle.classList.contains('activated')) {

        bitbot_toggle.classList.remove("activated");
        bitbot_toggle.classList.add("not-activated");

        settings.bitbot_dance = false;

        bitbot_toggle.innerHTML = "Add BitBot dance: No";

    }

});
