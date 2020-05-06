const possible_matches_table_body = document.getElementById("possible_matches_table_body");

const first_key_span = document.getElementById("first_key_span");
const description_span = document.getElementById("description_span");
const origin_name_input = document.getElementById("origin_name_input");
const origin_descr_input = document.getElementById("origin_descr_input");

const sysinfo_file_picker = document.getElementById("sysinfo_file_picker");
const matched_file_picker = document.getElementById("matched_file_picker");

const progress_span = document.getElementById("progress_span");

var s = {
    "sysinfo_text": "",
    "matched_text": "",
    "counter": 1,
    "keys": [],
}

function start() {
    try {
        const sysinfo_file = sysinfo_file_picker.files[0];
        const matched_file = matched_file_picker.files[0];
        read_file_as_text(sysinfo_file, "sysinfo_text");
        read_file_as_text(matched_file, "matched_text");
    } catch (error) {
        alert(error);
    }
}

function load_file(s_name, result) {
    s[s_name] = result;
    if (s.sysinfo_text != "" && s.matched_text != "") {
        load_files();
    }
}

function load_files() {
    s.sysinfo = JSON.parse(s.sysinfo_text);
    s.matched = JSON.parse(s.matched_text);
    s.keys = [];
    for (let first_key in s.sysinfo) {
        s.keys.push(first_key);
    }
    s.counter = 1;
    load_key();
}

function load_key() {
    if (s.counter <= s.keys.length) {
        let key = s.keys[s.counter-1];
        let description = s.sysinfo[key].description;
        let origin_name = s.sysinfo[key].origin_name;
        let origin_descr = s.sysinfo[key].origin_description;

        first_key_span.innerText = key;
        description_span.innerText = description;
        origin_name_input.value = origin_name;
        origin_descr_input.value = origin_descr;

        progress_span.innerText = s.counter+"/"+s.keys.length;

        deleteAllChildren();
        let possible_matches = s.matched[key].possible_matches;
        if (possible_matches) {
            for (let score_possible_match of possible_matches) {
                let score = score_possible_match[0];
                let possible_match = score_possible_match[1].split(";");
                let o_n = possible_match[0];
                let o_d = possible_match[1];
                addTableRow(score, o_n, o_d);
            }
            addTableRow(0, "None", "None");
        }
        s.counter++;
    }
}

function read_file_as_text(file, s_name) {
    try {
        const reader = new FileReader();
        reader.onload = function() {
            load_file(s_name, reader.result)
        }
        reader.readAsText(file);
    } catch (error) {
        throw error;
    }
}

function addTableRow(score, o_n, o_d) {
    row = "<tr onclick='chooseMe(this)' title='Click2Choose'><td>"+score+"</td><td>"+o_n+"</td><td>"+o_d+"</td></tr>";
    possible_matches_table_body.innerHTML += row;
}

function deleteAllChildren() {
    while(possible_matches_table_body.children.length != 0) {
        possible_matches_table_body.removeChild(possible_matches_table_body.firstElementChild);
    }
}

function chooseMe(element) {
    origin_name_input.value = element.children[1].innerHTML;
    origin_descr_input.value = element.children[2].innerHTML;
}

function submit() {
    if (first_key_span.innerText != "") {
        s.sysinfo[first_key_span.innerText].origin_name = origin_name_input.value;
        s.sysinfo[first_key_span.innerText].origin_descr = origin_descr_input.value;
        load_key() 
    }
}

function save() {
    let sysinfo_new_text = JSON.stringify(s.sysinfo, null, 1);
    download("sysinfo_new.json", sysinfo_new_text);
}

// Download function from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }