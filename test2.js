/*
A script that creates a menu in Bmr that you can use to load or create hypno messages, so have fun with it :P!
*/

var BMRHYPNO = {};

var bmrHypno = function() {
  var mainBox = createElement("div", "mainBox");
  var jsColor = {};
  var _menuModified = false;
  var _tabs = {
    "word": {
      "Base":createWordBaseTab,
      "Color":createWordColorTab,
      "Effects":createWordEffectsTab,
      "Preview":createWordPreviewTab
    },
    "image": {
      "Base":createImgBaseTab,
      "Effects":createImgEffectsTab,
      "Preview":createImgPreviewTab
    }
  };
  var _tabsTypes = [];
  var _tabsTitles = [];
  var _tabsContainers = [];
  var _colorPickers = [];
  var _currentlyLoaded = {};
  var _preloadedHypnos = {
    "New one": {
      "name": "",
      "spawnTime": "",
      "values": [
        {
          "type": "word",
          "value": "",
          "leaveTime": "",
          "position": "Random",
          "font": ["",""],
          "color": "Random",
          "border": "None",
          "gradient": "None",
          "opacity": "0.5",
          "rotation": ["0","0"],
          "animation": "None"
        }
      ]
    },
    "Load from file": "Load from file",
    "Random": {
      "name": "Random",
      "spawnTime": 1000,
      "values": [
        {
          "type": "word",
          "value": "slut",
          "leaveTime": 4120,
          "position": ["1.00%","3.14%"],
          "font": ["64","128"],
          "color": "#abc123",
          "border": "#def456",
          "gradient": {
            "gradients": [
              {
              "type": "radial-gradient",
              "direction": "circle",
              "colors": ["#008000FF","#0000FFFF","#D2FF1FFF","#C0FBFFFF","#1A2323FF"],
              "positions": ["0","15","25","75",""],
              "positions2": ["15","25","50","","80"]
            },
            {
              "type": "linear-gradient",
              "direction": 180,
              "colors": ["#FFFFFF00","#000000FF"],
              "positions": ["","75"],
              "positions2": ["",""]
            }
          ],
          "name": "ShadowBelow",
          "blendMode": "overlay"
          },
          "opacity": "0.5",
          "rotation": ["-45","45"],
          "animation": "None"
        },
        {
          "type": "img",
          "value": "woah,url"
        }
      ]
    }
  };
  var _preloadedGradients = {
    "New one": {
      "gradients": [
        {
        "type": "linear-gradient",
        "direction": 0,
        "colors": ["#000000FF","#848484FF"],
        "positions": ["",""],
        "positions2": ["",""]
      }
    ],
    "name": "New one",
    "blendMode": "normal"
    },
    "Rainbow1": {
      "gradients":  [
      {
        "type": "linear-gradient",
        "direction": 90,
        "colors": ["#FF0000FF","#FFA500FF","#FFFF00FF","#008000FF","#0000FFFF","#4B0082FF","#8F00FFFF"],
        "positions": ["","","","","","",""],
        "positions2": ["","","","","","",""]
      }
    ],
    "name": "Rainbow1",
    "blendMode": "overlay"
    },
    "ShadowBelow": {
      "gradients": [
        {
        "type": "linear-gradient",
        "direction": 180,
        "colors": ["#848484FF","#848484FF"],
        "positions": ["",""],
        "positions2": ["",""]
      },
      {
        "type": "linear-gradient",
        "direction": 180,
        "colors": ["#FFFFFF00","#000000FF"],
        "positions": ["","75"],
        "positions2": ["",""]
      }
    ],
    "name": "ShadowBelow",
    "blendMode": "overlay"
    },
    "RandomPositions": {
      "gradients": [
        {
        "type": "radial-gradient",
        "direction": "circle",
        "colors": ["#008000FF","#0000FFFF","#D2FF1FFF","#C0FBFFFF","#1A2323FF"],
        "positions": ["0","15","25","75",""],
        "positions2": ["15","25","50","","80"]
      },
      {
        "type": "linear-gradient",
        "direction": 180,
        "colors": ["#FFFFFF00","#000000FF"],
        "positions": ["","75"],
        "positions2": ["",""]
      }
    ],
    "name": "ShadowBelow",
    "blendMode": "overlay"
    }
  };
  const _templateHypno = {
    "name": "",
    "spawnTime": "",
    "values": [
      {
        "type": "word",
        "value": "",
        "leaveTime": "",
        "position": "Random",
        "font": ["",""],
        "color": "Random",
        "border": "None",
        "gradient": "None",
        "opacity": "0.5",
        "rotation": ["0","0"],
        "animation": "None"
      }
    ],
    "selectedValue": 0,
    "selectedGradient": 0,
    "selectedGradientColor": 0
  };
  const _templateGradient = {
    "gradients": [
      {
        "type": "linear-gradient",
        "direction": "0",
        "colors": ["#000000FF","#848484FF"],
        "positions": ["",""],
        "positions2": ["",""]
      },
    ],
    "name": "New one",
    "blendMode": "normal"
  };

  function startBmr() {
    //add mainBox to div id=menus in bmr
    //adds the close button and resets everything, uses css from bmr if mainBox was added to menus
    emptyMainBox();
    let topCont = createElement("div","topContainer","topStart");
    let closeButton = createElement("div","closeButton","button close");
    closeButton.onclick = () => { mainBox.remove(); };
    topCont.appendChild(closeButton);
    mainBox.appendChild(topCont);
    //adding the grid
    mainBox.appendChild(createBmrStartingGrid());

    if(!_menuModified) {
      document.getElementById("menu").getElementsByClassName("button")[0].onclick = rewrittenDropdownFunction();
      _menuModified = true;
    }

    return mainBox;
  }

  function createBmrStartingGrid() {
    //emptyMainBox();
    var grid = createElement("div","","grid-start");
    //add create btn
    grid.appendChild(createBmrCreateScreenBtn());
    //add cast btn
    grid.appendChild(createBmrCastScreenBtn());
    //add remove btn
    grid.appendChild(createBmrRemoveScreenBtn());

    return grid;
  }

  function createBmrCreateScreenBtn() {
    let createBtn = createElement("div","createBtn","gridButton","C R E A T E");
    createBtn.onclick = loadCreateScreen;
    return createBtn;
  }

  function createBmrCastScreenBtn() {
    let castBtn = createElement("div","castBtn","gridButton","C A S T");
    castBtn.onclick = (e) => { console.log("I haven't made the cast screen yet :c"); };
    return castBtn;
  }

  function createBmrRemoveScreenBtn() {
    let removeBtn = createElement("div","removeBtn","gridButton","R E M O V E");
    removeBtn.onclick = (e) => { console.log("I haven't made the remove screen yet :c"); };
    return removeBtn;
  }

  function loadCreateScreen() {
    emptyMainBox();
    let topContainerHTML = `
    <div id="topContainer" class="gridContainer">
      <div id="" class="gridLabel">Load from:</div>
      <select id="selectHypno" class="selectContainer">
      </select>
      <label id="loadFileLabel" class="" style="display: none;">
        <input id="loadFileBtn" class="" placeholder="" type="file">Load from file
      </label>
      <input id="backButton" class="" placeholder="" type="button" value="<">
      <div id="closeButton" class="button close"></div>
    </div>
    `;
    /* testing insertAdjacentHTML

    //top container here (load from and close button in it)
    let topContainer = createElement("div","topContainer","gridContainer");
    //load from label
    let loadFromLabel = createElement("div","","gridLabel","Load from:");
    topContainer.appendChild(loadFromLabel);
    //creating and loading the selection menu, along with the file btn
    let fileBtn = createElement("input","loadFileBtn");
    fileBtn.type = "file";
    //what happens after the file is loaded
    //TODO TODO TODO TODO TODO TODO TODO TODO TODO, for now just console log
    let loaded = (e) => {
      let tmpFr = e.target;
      let result = tmpFr.result;
      console.log(result);
      //let resultJSON = JSON.parse(result);
    };
    //How are the files processed when you load them
    let process = (file) => {
      let fr = new FileReader();
      fr.readAsText(file);
      fr.addEventListener('loadend', loaded);
    };
    //Making it so you process the file when you choose it
    fileBtn.addEventListener('change', (e) => {
      let file = fileBtn.files[0];
      process(file);
    });
    //label for the fileBtn so I can css it
    let fileBtnLabel = createElement("label","loadFileLabel");
    fileBtnLabel.appendChild(fileBtn);
    fileBtnLabel.append("Load from file");
    topContainer.appendChild(loadSelections(fileBtnLabel));
    topContainer.appendChild(fileBtnLabel);
    fileBtnLabel.style.display="none";
    //backButton
    let backButton = createElement("input","backButton");
    backButton.type = "button";
    backButton.value = "<";
    backButton.onclick = startBmr;
    topContainer.appendChild(backButton);
    //closeButton
    let closeButton = createElement("div","closeButton","button close");
    closeButton.onclick = () => { mainBox.remove(); };
    topContainer.appendChild(closeButton);
    mainBox.appendChild(topContainer);
    */
    mainBox.insertAdjacentHTML("beforeend",topContainerHTML);
    let fileBtn = document.getElementById("loadFileBtn");
    fileBtn.type = "file";
    //what happens after the file is loaded
    //TODO TODO TODO TODO TODO TODO TODO TODO TODO, for now just console log
    let loaded = (e) => {
      let tmpFr = e.target;
      let result = tmpFr.result;
      console.log(result);
      //let resultJSON = JSON.parse(result);
    };
    //How are the files processed when you load them
    let process = (file) => {
      let fr = new FileReader();
      fr.readAsText(file);
      fr.addEventListener('loadend', loaded);
    };
    //Making it so you process the file when you choose it
    fileBtn.addEventListener('change', (e) => {
      let file = fileBtn.files[0];
      process(file);
    });
    let backButton = document.getElementById("backButton");
    backButton.onclick = startBmr;
    let closeButton = document.getElementById("closeButton");
    closeButton.onclick = () => { mainBox.remove(); };
    let selectHypno = document.getElementById("selectHypno");
    loadSelections(selectHypno);
    //mainBox.appendChild(createCreateScreenGrid());
    createCreateScreenGrid();
  }

  function loadSelections(selections) {
    /*var selections = createElement("select","selectHypno","selectContainer");
    for(i in _preloadedHypnos) {
      selections.options.add(new Option(i,_preloadedHypnos[i]));
    }
    selections.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Load from file") {
        displayBtn.style.display = "";
      } else {
        loadSelectionInGrid(selected);
        displayBtn.style.display = "none";
      }
    };
    return selections;*/
    let displayBtn = document.getElementById("loadFileLabel");
    for(i in _preloadedHypnos) {
      selections.options.add(new Option(i,_preloadedHypnos[i]));
    }
    selections.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Load from file") {
        displayBtn.style.display = "";
      } else {
        loadSelectionInGrid(selected);
        displayBtn.style.display = "none";
      }
    };
  }

  function loadSelectionInGrid(selection) {
    //name
    _currentlyLoaded = _preloadedHypnos[selection.text];
    _currentlyLoaded.selectedValue=0;
    _currentlyLoaded.selectedGradient=0;
    _currentlyLoaded.selectedGradientColor=0;
    document.getElementById("formNameInput").value = selection.text;
    //spawnTime
    document.getElementById("formSpawnInput").value = _currentlyLoaded.spawnTime;
    document.getElementById("formSpawnRange").value = _currentlyLoaded.spawnTime;
    //values[0]
    let cur = _currentlyLoaded.values[0];
    if(_currentlyLoaded.values[0].type == "word") {
      changeTabType("word");
      //word
      document.getElementById("wordValueInput").value = cur.value;
      //leaveTime
      document.getElementById("wordTimeInput").value = cur.leaveTime;
      document.getElementById("wordTimeRange").value = cur.leaveTime;
      //position
      let selectPos = document.getElementById("wordPositionInputSelect");
      let pos1 = document.getElementById("wordPositionInput1");
      let pos2 = document.getElementById("wordPositionInput2");
      if(cur.position == "Random") {
        selectPos.selectedIndex = 0;
        pos1.style.display = "none";
        pos2.style.display = "none";
      } else {
        selectPos.selectedIndex = 1;
        pos1.style.display = "";
        pos2.style.display = "";
        pos1.value = cur.position[0];
        pos2.value = cur.position[1];
      }
      //font
      document.getElementById("wordFontInput1").value = cur.font[0];
      document.getElementById("wordFontInput2").value = cur.font[1];
      //color
      let selectCol = document.getElementById("wordColorSelect");
      let col1 = document.getElementById("wordColorInput");
      if(cur.color == "Random") {
        selectCol.selectedIndex = 0;
        col1.style.display = "none";
      } else {
        selectCol.selectedIndex = 1;
        col1.style.display = "";
        _colorPickers[0].fromString(cur.color);
      }
      //border
      let selectBor = document.getElementById("wordBorderSelect");
      let bor1 = document.getElementById("wordBorderInput");
      if(cur.border == "None") {
        selectBor.selectedIndex = 0;
        bor1.style.display = "none";
      } else {
        selectBor.selectedIndex = 1;
        bor1.style.display = "";
        _colorPickers[1].fromString(cur.border);
      }
      //gradient
      let wordGradientSelect = document.getElementById("wordGradientSelect");
      let wordGradientCreatorContainer = document.getElementById("wordGradientCreatorContainer");
      let wordGradientPreviewContainer = document.getElementById("wordGradientPreviewContainer");
      if(cur.gradient == "None") {
        wordGradientSelect.selectedIndex = 0;
        wordGradientCreatorContainer.style.display = "none";
        wordGradientPreviewContainer.style.display = "none";
      } else {
        wordGradientSelect.selectedIndex = 1;
        wordGradientCreatorContainer.style.display = "";
        wordGradientPreviewContainer.style.display = "";
        updateGradientPreviewLeft(cur.gradient,0,0);
        updateGradientPreviewRight(cur.gradient);
      }
      //opacity
      document.getElementById("wordOpacityInput").value = cur.opacity;
      document.getElementById("wordOpacityRange").value = cur.opacity;
      //rotation
      document.getElementById("wordRotationInput1").value = cur.rotation[0];
      document.getElementById("wordRotationInput2").value = cur.rotation[1];
      //animation/additional effects TODO
    }
    //that's all I have for now
  }
  
  function createCreateScreenGrid() {
    let createMenuHTML = `
    <div id="createMenu", class="menu-start">
      <div id="nameContainer" class="gridContainer">
        <div id="nameLabel" class="gridLabel">Choose a name for your set:</div>
        <div id="nameInputContainer">
          <input id="formNameInput" class="gridTextInput" placeholder="Name here." type="text">
        </div>
      </div>
      <div id="spawnContainer" class="gridContainer">
        <div id="spawnLabel" class="gridLabel">Choose how many milliseconds you want between each spawn:</div>
        <div id="spawnInputContainer" class="">
          <input id="formSpawnInput" class="gridTextInput" placeholder="ms here, can go past max." type="text">
          <input id="formSpawnRange" class="" placeholder="" type="range" min="100" max="5000">
        </div>
      </div>
      <div id="selectTypeContainer" class="gridContainer">
        <div id="wordTypeContainer" class="typeContainer activeType">Word/Text</div>
        <div id="imgTypeContainer" class="typeContainer">Image/Gif</div>
      </div>
      <div id="create-tab-start">
      </div>
    </div>
    `;
    /*
    let grid = createElement("div","createMenu","menu-start");
    //create name container
    let nameContainer = createElement("div","nameContainer","gridContainer");
    //add label and input to name container
    let nameLabel = createElement("div","nameLabel","gridLabel","Choose a name for your set:");
    let nameInputContainer = createElement("div","nameInputContainer");
    let nameInput = createElement("input","formNameInput","gridTextInput","","Name here.");
    nameInput.type = "text";
    nameInputContainer.appendChild(nameInput);
    nameContainer.appendChild(nameLabel);
    nameContainer.appendChild(nameInputContainer);
    //add nameContainer to grid
    grid.appendChild(nameContainer);
    
    //create spawn container
    let spawnContainer = createElement("div","spawnContainer","gridContainer");
    //add label and inputs to spawn container
    let spawnLabel = createElement("div","spawnLabel","gridLabel","Choose how many milliseconds you want between each spawn:");
    let spawnInputContainer = createElement("div","spawnInputContainer");
    let spawnInput = createElement("input","formSpawnInput","gridTextInput","","ms here, can go past max.");
    let spawnInputRange = createElement("input","formSpawnRange");
    spawnInput.type = "text";
    spawnInputRange.type = "range";
    spawnInputRange.min = 100;
    spawnInputRange.max = 5000;
    //making the two inputs update each other //TODO LATER CHECK CORRECT VALUE
    spawnInput.oninput = (e) => {spawnInputRange.value = e.target.value;}
    spawnInput.onchange = (e) => {spawnInputRange.value = e.target.value;}
    spawnInputRange.oninput = (e) => {spawnInput.value = e.target.value;}
    spawnInputRange.onchange = (e) => {spawnInput.value = e.target.value;}
    //add them in container
    spawnInputContainer.appendChild(spawnInput);
    spawnInputContainer.appendChild(spawnInputRange);
    spawnContainer.appendChild(spawnLabel);
    spawnContainer.appendChild(spawnInputContainer);
    //add spawnContainer to grid
    grid.appendChild(spawnContainer);

    //add the selection boxes for word and img
    let selectTypeContainer = createElement("div","selectTypeContainer","gridContainer");
    //word box
    let wordTypeContainer = createElement("div","wordTypeContainer","typeContainer activeType","Word/Text");
    wordTypeContainer.onclick = (e) => {
      //TODO Change format of the inputs below
      changeTabType("word");
    };
    _tabsTypes.push(wordTypeContainer);
    //img box
    let imgTypeContainer = createElement("div","imgTypeContainer","typeContainer","Image/Gif");
    imgTypeContainer.onclick = (e) => {
      //TODO Change format of the inputs below
      changeTabType("image");
    };
    _tabsTypes.push(imgTypeContainer);
    selectTypeContainer.appendChild(wordTypeContainer);
    selectTypeContainer.appendChild(imgTypeContainer);
    grid.appendChild(selectTypeContainer);

    //creating the tabbed part
    let createTabbedContainer = createElement("div","create-tab-start");
    fillTabs(createTabbedContainer);
    grid.appendChild(createTabbedContainer);
    //simpleTabCauseTired(createTabbedContainer);

    //TODO, make a function that adds passed string as input button for grid
    //TODO first though, make it so it loads _currentlyLoaded
    return grid;
    */
    mainBox.insertAdjacentHTML("beforeend",createMenuHTML);
    //name of the set
    let formNameInput = document.getElementById("formNameInput");
    formNameInput.oninput = (e) => {
      _currentlyLoaded.name = e.target.value;
      console.log(_currentlyLoaded);
    }
    formNameInput.onchange = formNameInput.oninput;

    //making the two inputs update each other //TODO LATER CHECK CORRECT VALUE
    let spawnInput = document.getElementById("formSpawnInput");
    let spawnInputRange = document.getElementById("formSpawnRange");
    spawnInput.oninput = (e) => {
      spawnInputRange.value = e.target.value;
      _currentlyLoaded.spawnTime = e.target.value;
    }
    spawnInput.onchange = spawnInput.oninput;
    spawnInputRange.oninput = (e) => {
      spawnInput.value = e.target.value;
      _currentlyLoaded.spawnTime = e.target.value;
    }
    spawnInputRange.onchange = spawnInputRange.oninput;
    //select word/img
    //word
    let wordTypeContainer = document.getElementById("wordTypeContainer");
    let imgTypeContainer = document.getElementById("imgTypeContainer");
    wordTypeContainer.onclick = (e) => {
      //TODO Change format of the inputs below
      changeTabType("word");
    };
    //img
    imgTypeContainer.onclick = (e) => {
      //TODO Change format of the inputs below
      changeTabType("image");
    };
    _tabsTypes.push(wordTypeContainer);
    _tabsTypes.push(imgTypeContainer);
    //creating the tabbed part
    let createTabbedContainer = document.getElementById("create-tab-start");
    fillTabs(createTabbedContainer);
  }

  function fillTabs(wholeContainer) {
    let tabsTitleContainer = createElement("div","tabsTitleContainer");
    let tabsContainer = createElement("div","tabsContainer");
    wholeContainer.appendChild(tabsTitleContainer);
    wholeContainer.appendChild(tabsContainer);
    let whichTabInfo = 0;
    for(i in _tabs) {
      for(j in _tabs[i]) {
        //creating titles for the tabs
        let curTabInfo = whichTabInfo;
        let tabTitle = createElement("div",i+j+"CreateTitle","tabTitle",j);
        tabTitle.onclick = (e) => {
          changeTab(curTabInfo);
        };
        _tabsTitles.push(tabTitle);
        tabsTitleContainer.appendChild(tabTitle);
        //creating the actual tab
        let tabContainer = _tabs[i][j]();
        //tabsContainer.appendChild(tabContainer); added to _tabs[i][j] so I can get the ids
        _tabsContainers.push(tabContainer);
        whichTabInfo+=1;
      }
    }
    changeTabType("word");
  }

  function createWordBaseTab() {
    /*
    //the tab
    let tab = createElement("div","wordBaseTab","createTab");
    //all its elements
    //value
    let valueContainer = createElement("div","wordValueContainer","tabWordContainer");
    let wordValueLabel = createElement("div","wordValueLabel","gridLabel","Type the word/text that you wish to use:");
    valueContainer.appendChild(wordValueLabel);
    let wordValueInputContainer =createElement("div","wordValueInputContainer");
    let wordValueInput = createElement("input","wordValueInput","gridTextInput","","Text here.");
    wordValueInput.type = "text";
    wordValueInputContainer.appendChild(wordValueInput);
    valueContainer.appendChild(wordValueInputContainer);
    tab.appendChild(valueContainer);
    //time TODO
    let wordTimeContainer = createElement("div","wordTimeContainer","tabWordContainer");
    let wordTimeLabel = createElement("div","wordTimeLabel","gridLabel","How long before the word leaves? (in milliseconds)");
    let wordTimeInputContainer = createElement("div","wordTimeInputContainer");
    let wordTimeInput = createElement("input","wordTimeInput","gridTextInput","","ms here, can go past max.");
    let wordTimeRange = createElement("input","wordTimeRange");

    wordTimeInput.type = "text";
    wordTimeRange.type = "range";
    wordTimeRange.min = 10;
    wordTimeRange.max = 10000;
    //making the two inputs update each other //TODO LATER CHECK CORRECT VALUE
    wordTimeInput.oninput = (e) => {wordTimeRange.value = e.target.value;}
    wordTimeInput.onchange = (e) => {wordTimeRange.value = e.target.value;}
    wordTimeRange.oninput = (e) => {wordTimeInput.value = e.target.value;}
    wordTimeRange.onchange = (e) => {wordTimeInput.value = e.target.value;}

    wordTimeContainer.appendChild(wordTimeLabel);
    wordTimeContainer.appendChild(wordTimeInputContainer);
    wordTimeInputContainer.appendChild(wordTimeInput);
    wordTimeInputContainer.appendChild(wordTimeRange);
    tab.appendChild(wordTimeContainer);
    //position TODO
    let wordPositionContainer = createElement("div","wordPositionContainer","tabWordContainer");
    let wordPositionLabel = createElement("div","wordPositionLabel","gridLabel","Where should your word be?");
    let wordPositionInputContainer = createElement("div","wordPositionInputContainer");
    let wordPositionInputSelect = createElement("select","wordPositionInputSelect","selectContainer");
    let wordPositionInput1 = createElement("input","wordPositionInput1","gridTextInput","","% from top");
    let wordPositionInput2 = createElement("input","wordPositionInput2","gridTextInput","","% from left");

    wordPositionInput1.type = "text";
    wordPositionInput1.style.display = "none";
    wordPositionInput2.type = "text";
    wordPositionInput2.style.display = "none";
    wordPositionInputSelect.options.add(new Option("Random","Random"));
    wordPositionInputSelect.options.add(new Option("Precise Position","Precise Position"));
    wordPositionInputSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Random") {
        wordPositionInput1.style.display = "none";
        wordPositionInput2.style.display = "none";
      } else {
        wordPositionInput1.style.display = "";
        wordPositionInput2.style.display = "";
        let chooseWindow = createElement("div","chooseWindow","","Click where you would like your word top-left corner to be.");
        document.getElementById("scaler").appendChild(chooseWindow);
        chooseWindow.onclick = (evt) => {
          let boundRect=evt.target.getBoundingClientRect();
          wordPositionInput1.value = ((evt.clientX-boundRect.left)*100/boundRect.width).toFixed(2)+"%";
          wordPositionInput2.value = ((evt.clientY-boundRect.top)*100/boundRect.height).toFixed(2)+"%";
          chooseWindow.remove();
        };
      }
    };
    wordPositionContainer.appendChild(wordPositionLabel);
    wordPositionContainer.appendChild(wordPositionInputContainer);
    wordPositionInputContainer.appendChild(wordPositionInputSelect);
    wordPositionInputContainer.appendChild(wordPositionInput1);
    wordPositionInputContainer.appendChild(wordPositionInput2);
    tab.appendChild(wordPositionContainer);
    //font size TODO
    let wordFontContainer = createElement("div","wordFontContainer","tabWordContainer");
    let wordFontLabel = createElement("div","wordFontLabel","gridLabel","Font size? (Random between the 2)");
    let wordFontInputContainer = createElement("div","wordFontInputContainer");
    let wordFontInput1 = createElement("input","wordFontInput1","gridTextInput","","Min value.");
    let wordFontInput2 = createElement("input","wordFontInput2","gridTextInput","","Max value.");
    let fontMin = createElement("div","fontPreviewMin","fontPreview","Min");
    let fontMax = createElement("div","fontPreviewMax","fontPreview","Max");
    fontMin.style.display = "none";
    fontMax.style.display = "none";
    
    wordFontInput1.type = "text";
    wordFontInput2.type = "text";

    wordFontInput1.onfocus = (e)=>{
      fontMin.style.display = "";
      fontMax.style.display = "";
    };
    wordFontInput1.onblur = (e)=>{
      fontMin.style.display = "none";
      fontMax.style.display = "none"
    };
    wordFontInput1.oninput = (e)=>{
      fontMin.style.fontSize = wordFontInput1.value+"px";
      fontMax.style.fontSize = wordFontInput2.value+"px";
    }
    wordFontInput1.onchange = wordFontInput1.oninput;
    wordFontInput2.onfocus = wordFontInput1.onfocus;
    wordFontInput2.onblur = wordFontInput1.onblur;
    wordFontInput2.oninput = wordFontInput1.oninput;
    wordFontInput2.onchange = wordFontInput1.onchange;

    wordFontContainer.appendChild(wordFontLabel);
    wordFontContainer.appendChild(wordFontInputContainer);
    wordFontInputContainer.appendChild(wordFontInput1);
    wordFontInputContainer.appendChild(wordFontInput2);
    wordFontInputContainer.appendChild(fontMin);
    wordFontInputContainer.appendChild(fontMax);
    tab.appendChild(wordFontContainer);
    return tab;
    */
    //// insertAdjacentHTML from here on
    let tab = createElement("div","wordBaseTab","createTab");
    let createWordBaseTabHTML = `
    <div id="wordValueContainer" class="tabWordContainer">
      <div id="wordValueLabel" class="gridLabel">Type the word/text that you wish to use:</div>
      <div id="wordValueInputContainer">
        <input id="wordValueInput" class="gridTextInput" placeholder="Text here." type="text">
      </div>
    </div>
    <div id="wordTimeContainer" class="tabWordContainer">
      <div id="wordTimeLabel" class="gridLabel">How long before the word leaves? (in milliseconds)</div>
      <div id="wordTimeInputContainer">
        <input id="wordTimeInput" class="gridTextInput" placeholder="ms here, can go past max." type="text">
        <input id="wordTimeRange" placeholder="" type="range" min="10" max="10000">
      </div>
    </div>
    <div id="wordPositionContainer" class="tabWordContainer">
      <div id="wordPositionLabel" class="gridLabel">Where should your word be?</div>
      <div id="wordPositionInputContainer">
        <select id="wordPositionInputSelect" class="selectContainer">
          <option value="Random">Random</option>
          <option value="Precise Position">Precise Position</option>
        </select>
        <input id="wordPositionInput1" class="gridTextInput" placeholder="% from top" type="text" style="display: none;">
        <input id="wordPositionInput2" class="gridTextInput" placeholder="% from left" type="text" style="display: none;">
      </div>
    </div>
    <div id="wordFontContainer" class="tabWordContainer">
      <div id="wordFontLabel" class="gridLabel">Font size? (Random between the 2)</div>
      <div id="wordFontInputContainer">
        <input id="wordFontInput1" class="gridTextInput" placeholder="Min value." type="text">
        <input id="wordFontInput2" class="gridTextInput" placeholder="Max value." type="text">
        <div id="fontPreviewMin" class="fontPreview" style="display: none;">Min</div>
        <div id="fontPreviewMax" class="fontPreview" style="display: none;">Max</div>
      </div>
    </div>
    `;
    tab.insertAdjacentHTML("beforeend",createWordBaseTabHTML);
    document.getElementById("tabsContainer").appendChild(tab);
    //value
    let wordValueInput = document.getElementById("wordValueInput");
    wordValueInput.oninput = (e) => {
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].value = e.target.value;
    }
    //time
    let wordTimeInput = document.getElementById("wordTimeInput");
    let wordTimeRange = document.getElementById("wordTimeRange");
    wordTimeInput.oninput = (e) => {
      wordTimeRange.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].leaveTime = e.target.value;
    }
    wordTimeInput.onchange = (e) => wordTimeInput.oninput;
    wordTimeRange.oninput = (e) => {
      wordTimeInput.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].leaveTime = e.target.value;
    }
    wordTimeRange.onchange = (e) => wordTimeRange.oninput;

    //position
    let wordPositionInputSelect = document.getElementById("wordPositionInputSelect");
    let wordPositionInput1 = document.getElementById("wordPositionInput1");
    let wordPositionInput2 = document.getElementById("wordPositionInput2");
    wordPositionInputSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Random") {
        wordPositionInput1.style.display = "none";
        wordPositionInput2.style.display = "none";
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].position = "Random";
      } else {
        wordPositionInput1.style.display = "";
        wordPositionInput2.style.display = "";
        let chooseWindow = createElement("div","chooseWindow","","Click where you would like your word top-left corner to be.");
        document.getElementById("scaler").appendChild(chooseWindow);
        chooseWindow.onclick = (evt) => {
          let boundRect=evt.target.getBoundingClientRect();
          wordPositionInput1.value = ((evt.clientX-boundRect.left)*100/boundRect.width).toFixed(2)+"%";
          wordPositionInput2.value = ((evt.clientY-boundRect.top)*100/boundRect.height).toFixed(2)+"%";
          _currentlyLoaded.values[_currentlyLoaded.selectedValue].position = [wordPositionInput1.value,wordPositionInput2.value];
          chooseWindow.remove();
        };
      }
    };
    wordPositionInput1.oninput = (e) => {
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].position[0] = e.target.value;
    }
    wordPositionInput1.onchange = wordPositionInput1.oninput;
    wordPositionInput2.oninput = (e) => {
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].position[1] = e.target.value;
    }
    wordPositionInput2.onchange = wordPositionInput2.oninput;

    //font
    let wordFontInput1 = document.getElementById("wordFontInput1");
    let wordFontInput2 = document.getElementById("wordFontInput2");
    let fontMin = document.getElementById("fontPreviewMin");
    let fontMax = document.getElementById("fontPreviewMax");
    wordFontInput1.onfocus = (e)=>{
      fontMin.style.display = "";
      fontMax.style.display = "";
    };
    wordFontInput1.onblur = (e)=>{
      fontMin.style.display = "none";
      fontMax.style.display = "none"
    };
    wordFontInput1.oninput = (e)=>{
      fontMin.style.fontSize = wordFontInput1.value+"px";
      fontMax.style.fontSize = wordFontInput2.value+"px";
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].font = [wordFontInput1.value, wordFontInput2.value];
    }
    wordFontInput1.onchange = wordFontInput1.oninput;
    wordFontInput2.onfocus = wordFontInput1.onfocus;
    wordFontInput2.onblur = wordFontInput1.onblur;
    wordFontInput2.oninput = wordFontInput1.oninput;
    wordFontInput2.onchange = wordFontInput1.onchange;

    return tab;
  }

  function createWordColorTab() {
    /*
    let tab = createElement("div","wordColorTab","createTab");
    //all the elements
    //the color
    let wordColorContainer = createElement("div","wordColorContainer","tabWordContainer");
    let wordColorLabel = createElement("div","wordColorLabel","gridLabel","Color for your word:");
    let wordColorInputContainer = createElement("div","wordColorInputContainer");
    let wordColorSelect = createElement("select","wordColorSelect","selectContainer");
    let wordColorInput = createElement("input","wordColorInput","gridTextInput","","# Color Code");
    var wordColorPicker = new jsColor(wordColorInput,{format:'hex',
      previewPosition:'right',
      previewSize:50,
      backgroundColor:'rgba(0,0,0,0.9)',
      borderColor:'#343434',
      borderWidth:2});

    wordColorSelect.options.add(new Option("Random","Random"));
    wordColorSelect.options.add(new Option("Choose","Choose"));
    wordColorSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Random") {
        wordColorInput.style.display = "none";
      } else {
        wordColorInput.style.display = "";
      }
    };

    wordColorInput.style.display = "none";
    wordColorInput.type = "text";
    _colorPickers.push(wordColorPicker);
    
    wordColorContainer.appendChild(wordColorLabel);
    wordColorContainer.appendChild(wordColorInputContainer);
    wordColorInputContainer.appendChild(wordColorSelect);
    wordColorInputContainer.appendChild(wordColorInput);
    tab.appendChild(wordColorContainer);
    //border
    let wordBorderContainer = createElement("div","wordBorderContainer","tabWordContainer");
    let wordBorderLabel = createElement("div","wordBorderLabel","gridLabel","Color for your border:");
    let wordBorderInputContainer = createElement("div","wordBorderInputContainer");
    let wordBorderSelect = createElement("select","wordBorderSelect","selectContainer");
    let wordBorderInput = createElement("input","wordBorderInput","gridTextInput","","# Color Code");
    var wordBorderPicker = new jsColor(wordBorderInput,{format:'hex',
      previewPosition:'right',
      previewSize:50,
      backgroundColor:'rgba(0,0,0,0.9)',
      borderColor:'#343434',
      borderWidth:2});

    wordBorderSelect.options.add(new Option("None","None"));
    wordBorderSelect.options.add(new Option("Choose","Choose"));
    wordBorderSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "None") {
        wordBorderInput.style.display = "none";
      } else {
        wordBorderInput.style.display = "";
      }
    };

    wordBorderInput.style.display = "none";
    wordBorderInput.type = "text";
    _colorPickers.push(wordBorderPicker);
    
    wordBorderContainer.appendChild(wordBorderLabel);
    wordBorderContainer.appendChild(wordBorderInputContainer);
    wordBorderInputContainer.appendChild(wordBorderSelect);
    wordBorderInputContainer.appendChild(wordBorderInput);
    tab.appendChild(wordBorderContainer);
    //TODO Gradients!!!
    let wordGradientContainer = createElement("div","wordGradientContainer","tabWordContainer");
    let wordGradientLabel = createElement("div","wordGradientLabel","gridLabel","Gradients! (You may choose to replace the color with a gradient instead. Be warned that your color will be ignored if you choose this)");
    let wordGradientInputContainer = createElement("div","wordGradientInputContainer"); 
    let wordGradientSelect = createElement("select","wordGradientSelect","selectContainer");
    let wordGradientPreviewContainer = createElement("div","wordGradientPreviewContainer","fontPreview");
    let wordGradientCreatorContainer = createElement("div","wordGradientCreatorContainer","fontPreview");
    let wordGradientPreviewBg = createElement("div","wordGradientPreviewBg","gradientPreview");
    let wordGradientPreviewTextContainer = createElement("div","wordGradientPreviewTextContainer","gradientPreview");
    let wordGradientPreviewText = createElement("div","wordGradientPreviewText","","Test");
    
    wordGradientSelect.options.add(new Option("None","None"));
    wordGradientSelect.options.add(new Option("Yes","Yes"));
    //TODO move these to the creator part
    wordGradientSelect.options.add(new Option("Linear","Linear"));
    wordGradientSelect.options.add(new Option("Radial","Radial"));
    wordGradientSelect.options.add(new Option("Conic","Conic"));
    wordGradientSelect.options.add(new Option("Repeating Linear","Repeating Linear"));
    wordGradientSelect.options.add(new Option("Repeating Radial","Repeating Radial"));
    wordGradientSelect.options.add(new Option("Repeating Conic","Repeating Conic"));

    //all the stuff for the creator her
    //select part
    let preloadGradientContainer = createElement("div","preloadGradientContainer","gradientCreatorBox");
    let preloadGradientLabel = createElement("div","preloadGradientLabel","gradientLabel","Preload?");
    let preloadGradientSelect = createElement("select","preloadGradientSelect","selectContainer");

    /* I guess I'll just load them manually :/, no idea what's wrong with these
    for(i in _preloadedGradients) {
      preloadGradientSelect.options.add(new Option(_preloadedGradients[i],"aaa"));
    }
    /* sinner down here
    for(i in _preloadedGradients) {
      console.log("What am I doing here?????? why error at 382???")
      console.log(i);
      preloadGradientSelect.options.add(new Option(i,i));
    }
    /* try again...
    console.log(_preloadedGradients);
    preloadGradientSelect.options.add(new Option("Rainbow1","Rainbow1"));
    preloadGradientSelect.options.add(new Option("ShadowBelow","ShadowBelow"));
    *//*
    preloadGradientSelect.options.add(new Option("New one","New one"));
    preloadGradientSelect.options.add(new Option("Rainbow1","Rainbow1"));
    preloadGradientSelect.options.add(new Option("ShadowBelow","ShadowBelow"));
    preloadGradientSelect.onchange = (e) => {
      //TODO move this in a func cause I need it later
      let selected = e.target.options[e.target.selectedIndex].text;
        let grad = "";
        for(i in _preloadedGradients[selected]) {
          if(i!="blendMode") {
            grad+=`${_preloadedGradients[selected][i].type}(${_preloadedGradients[selected][i].direction},`;
            for(j in _preloadedGradients[selected][i].colors) {
              grad+=`${_preloadedGradients[selected][i].colors[j]} ${_preloadedGradients[selected][i].positions[j]},`;
            }
            grad = grad.slice(0,-1);
            grad+="),";
          }
        }
        grad = grad.slice(0,-1);
        wordGradientPreviewBg.style.backgroundImage=grad;
        wordGradientPreviewBg.style.backgroundBlendMode=_preloadedGradients[selected].blendMode;
        wordGradientPreviewText.style.backgroundImage=grad;
        wordGradientPreviewText.style.backgroundBlendMode=_preloadedGradients[selected].blendMode;
    };

    preloadGradientContainer.appendChild(preloadGradientLabel);
    preloadGradientContainer.appendChild(preloadGradientSelect);
    wordGradientCreatorContainer.appendChild(preloadGradientContainer);

    //name part
    let nameGradientContainer = createElement("div","nameGradientContainer","gradientCreatorBox");
    let nameGradientLabel = createElement("div","nameGradientLabel","gradientLabel","Name?");
    let nameGradientInput = createElement("input","nameGradientInput","gradientTextInput","","Name here");
    nameGradientInput.type = "text";
    
    nameGradientContainer.appendChild(nameGradientLabel);
    nameGradientContainer.appendChild(nameGradientInput);
    wordGradientCreatorContainer.appendChild(nameGradientContainer);
    //buttons!
    let gradientBtnContainer = createElement("div","gradientBtnContainer","gradientCreatorBox");
    let gradientAddBtn = createElement("div","gradientAddBtn","gradientBtn","+");
    let gradientRemoveBtn = createElement("div","gradientRemoveBtn","gradientBtn","-");

    gradientAddBtn.onclick = (e) => {
      //TODO add a gradient
    };
    gradientRemoveBtn.onclick = (e) => {
      //TODO remove selected grad unless None
    };

    gradientBtnContainer.appendChild(gradientAddBtn);
    gradientBtnContainer.appendChild(gradientRemoveBtn);
    wordGradientCreatorContainer.appendChild(gradientBtnContainer);

    //Choose current gradient
    let gradientSelectedContainer = createElement("div","gradientSelectedContainer","gradientCreatorBox");
    let gradientSelectedLabel = createElement("div","gradientSelectedLabel","gradientLabel","Selected:");
    let gradientSelectedSelect = createElement("select","gradientSelectedSelect","selectContainer");

    gradientSelectedSelect.options.add(new Option("None","None"));
    gradientSelectedSelect.onchange = (e) => {
      //TODO hide everything with none, load the gradient when chosen
    }

    gradientSelectedContainer.appendChild(gradientSelectedLabel);
    gradientSelectedContainer.appendChild(gradientSelectedSelect);
    wordGradientCreatorContainer.appendChild(gradientSelectedContainer);


    //add everything
    wordGradientInputContainer.appendChild(wordGradientSelect);
    wordGradientInputContainer.appendChild(wordGradientCreatorContainer);
    wordGradientPreviewContainer.appendChild(wordGradientPreviewBg);
    wordGradientPreviewTextContainer.appendChild(wordGradientPreviewText);
    wordGradientPreviewContainer.appendChild(wordGradientPreviewTextContainer);
    wordGradientInputContainer.appendChild(wordGradientPreviewContainer);
    wordGradientContainer.appendChild(wordGradientLabel);
    wordGradientContainer.appendChild(wordGradientInputContainer);
    tab.appendChild(wordGradientContainer);

    document.getElementById("tabsContainer").appendChild(tab);
    return tab;
    */
    //remaking color down here 
    let tab = createElement("div","wordColorTab","createTab");
    let createWordColorTabHTML = `
    <div id="wordColorContainer" class="tabWordContainer">
      <div id="wordColorLabel" class="gridLabel">Color for your word:</div>
      <div id="wordColorInputContainer" class="">
        <select id="wordColorSelect" class="selectContainer">
          <option value="Random">Random</option>
          <option value="Choose">Choose</option>
        </select>
        <input id="wordColorInput" class="gridTextInput" placeholder="# Color Code" style="display: none;" type="text">
      </div>
    </div>
    <div id="wordBorderContainer" class="tabWordContainer">
      <div id="wordBorderLabel" class="gridLabel">Color for your border:</div>
      <div id="wordBorderInputContainer">
        <select id="wordBorderSelect" class="selectContainer">
          <option value="None">None</option>
          <option value="Choose">Choose</option>
        </select>
        <input id="wordBorderInput" class="gridTextInput" placeholder="# Color Code" style="display: none;" type="text">
      </div>
    </div>
    <div id="wordGradientContainer" class="tabWordContainer">
      <div id="wordGradientLabel" class="gridLabel">Gradients! (You may choose to replace the color with a gradient instead. Be warned that your color will be ignored if you choose this)</div>
      <div id="wordGradientInputContainer">
        <select id="wordGradientSelect" class="selectContainer">
          <option value="None">None</option>
          <option value="Yes">Yes</option>
        </select>
        <div id="wordGradientCreatorContainer" class="fontPreview" style="display: none;">
          <div id="preloadGradientContainer" class="sideCreatorBox">
            <div id="preloadGradientLabel" class="gradientLabel">Preload?</div>
              <select id="preloadGradientSelect" class="selectContainer">
              </select>
             </div>
            <div id="nameGradientContainer" class="sideCreatorBox">
              <div id="nameGradientLabel" class="gradientLabel">Name?</div>
              <input id="nameGradientInput" class="gradientTextInput" placeholder="Name here" type="text">
            </div>
            <div id="blendGradientContainer" class="sideCreatorBox">
              <div id="blendGradientLabel" class="gradientLabel">Blend Type</div>
              <select id="blendSelect" class="selectContainer">
                <option value="normal">normal</option>
                <option value="multiply">multiply</option>
                <option value="screen">screen</option>
                <option value="overlay">overlay</option>
                <option value="darken">darken</option>
                <option value="lighten">lighten</option>
                <option value="color-dodge">color-dodge</option>
                <option value="color-burn">color-burn</option>
                <option value="hard-light">hard-light</option>
                <option value="soft-light">soft-light</option>
                <option value="difference">difference</option>
                <option value="exclusion">exclusion</option>
                <option value="hue">hue</option>
                <option value="saturation">saturation</option>
                <option value="color">color</option>
                <option value="luminosity">luminosity</option>
              </select>
            </div>                    
            <div id="gradientSelectedContainer" class="sideCreatorBox">
              <div id="gradientSelectedLabel" class="gradientLabel">Selected Gradient</div>
              <select id="gradientSelectedSelect" class="selectContainer">
                <option value="0">0</option>
              </select>
              <div id="gradientBtnContainer" class="sideCreatorBox">
                <div id="gradientAddBtn" class="gradientBtn">+</div>
                <div id="gradientRemoveBtn" class="gradientBtn">-</div>
              </div>
            </div>
            <div id="typeGradientContainer" class="sideCreatorBox">
              <div id="typeGradientLabel" class="gradientLabel">Type</div>
              <select id="typeGradientSelect" class="selectContainer">
                <option value="linear-gradient">linear</option>
                <option value="radial-gradient">radial</option>
                <option value="conic-gradient">conic</option>
                <option value="repeating-linear-gradient">repeating linear</option>
                <option value="repeating-radial-gradient">repeating radial</option>
                <option value="repeating-conic-gradient">repeating conic</option>
              </select>
            </div>
            <div id="angleGradientContainer" class="sideCreatorBox">
              <div id="angleGradientLabel" class="gradientLabel">Angle</div>
              <input id="angleGradientInput" class="gradientTextInput" placeholder="Use deg" type="text">
              <input id="angleGradientInputRange" class="gradientTextInput" placeholder="0" type="range" min="0" max="360">
            </div>
            <div id="shapeGradientContainer" class="sideCreatorBox" style="display: none;">
              <div id="shapeGradientLabel" class="gradientLabel">Shape</div>
              <select id="shapeSelect" class="selectContainer">
                <option value="ellipse">ellipse</option>
                <option value="circle">circle</option>
              </select>
            </div>
            <div id="colorGradientSelectedContainer" class="sideCreatorBox">
              <div id="colorGradientSelectedLabel" class="gradientLabel">Selected color:</div>
              <select id="colorGradientSelectedSelect" class="selectContainer">
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <div id="colorGradientBtnContainer" class="sideCreatorBox">
                <div id="colorGradientAddBtn" class="gradientBtn">+</div>
                <div id="colorGradientRemoveBtn" class="gradientBtn">-</div>
              </div>
            </div>
            <div id="changeColorGradientContainer" class="sideCreatorBox">
              <div id="changeColorGradientLabel" class="gradientLabel">Change Color</div>
              <input id="changeColorGradientInput" class="gradientTextInput" placeholder="# Color Code" type="text">
            </div>
            <div id="positionGradientContainer" class="sideCreatorBox">
              <select id="positionGradientSelect" class="gradientLabel">
                <option>Start at</option>
                <option>End at</option>
              </select>
              <input id="positionGradientInput" class="gradientTextInput" type="text" placeholder="Auto">
              <input id="positionGradientInputRange" class="gradientTextInput" placeholder="50" type="range" min="0" max="100">
            </div>
            <div id="previewGradientContainer" class="sideCreatorBox">                                
            </div>
          </div>
        <div id="wordGradientPreviewContainer" class="fontPreview" style="display: none;">
          <div id="wordGradientPreviewBg" class="gradientPreview"></div>
          <div id="wordGradientPreviewTextContainer" class="gradientPreview">
            <div id="wordGradientPreviewText" class="">Test</div>
          </div>
        </div>
      </div>
    </div>
    `;
    tab.insertAdjacentHTML("beforeend",createWordColorTabHTML);
    document.getElementById("tabsContainer").appendChild(tab);
    //color
    let wordColorInput = document.getElementById("wordColorInput");
    var wordColorPicker = new jsColor(wordColorInput,{format:'hex',
      previewPosition:'right',
      previewSize:50,
      backgroundColor:'rgba(0,0,0,0.9)',
      borderColor:'#343434',
      borderWidth:2});
    let wordColorSelect = document.getElementById("wordColorSelect");
    wordColorSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "Random") {
        wordColorInput.style.display = "none";
      } else {
          wordColorInput.style.display = "";
      }
    };
    _colorPickers.push(wordColorPicker);
    //border
    let wordBorderInput = document.getElementById("wordBorderInput");
    var wordBorderPicker = new jsColor(wordBorderInput,{format:'hex',
      previewPosition:'right',
      previewSize:50,
      backgroundColor:'rgba(0,0,0,0.9)',
      borderColor:'#343434',
      borderWidth:2});
    let wordBorderSelect = document.getElementById("wordBorderSelect");
    wordBorderSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text == "None") {
        wordBorderInput.style.display = "none";
      } else {
        wordBorderInput.style.display = "";
      }
    };
    _colorPickers.push(wordBorderPicker);
    //gradient
    let wordGradientSelect = document.getElementById("wordGradientSelect");
    wordGradientSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      let wordGradientCreatorContainer = document.getElementById("wordGradientCreatorContainer");
      let wordGradientPreviewContainer = document.getElementById("wordGradientPreviewContainer");
      if(selected.text == "None") {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient = "None";
        wordGradientCreatorContainer.style.display = "none";
        wordGradientPreviewContainer.style.display = "none";
      } else {
        if(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient == "None") {
          _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient = JSON.parse(JSON.stringify(_templateGradient));
          _currentlyLoaded.selectedGradient = 0;
          _currentlyLoaded.selectedGradientColor = 0;
          updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,0,0);
          updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
        }
        wordGradientCreatorContainer.style.display = "";
        wordGradientPreviewContainer.style.display = "";
      }
    }

    //gradientPreviews
    let preloadGradientSelect = document.getElementById("preloadGradientSelect");
    let wordGradientPreviewBg = document.getElementById("wordGradientPreviewBg");
    let wordGradientPreviewText = document.getElementById("wordGradientPreviewText");
    preloadGradientSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex].text;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient = _preloadedGradients[selected];
      _currentlyLoaded.selectedGradient = 0;
      _currentlyLoaded.selectedGradientColor = 0;
      updateGradientPreviewRight(_preloadedGradients[selected]);
      updateGradientPreviewLeft(_preloadedGradients[selected],0,0); 
    };
    for(gradName in _preloadedGradients) {
      console.log(gradName);
      preloadGradientSelect.options.add(new Option(gradName,gradName));
    }

    //gradient +/- buttons
    let gradientAddBtn = document.getElementById("gradientAddBtn");
    let gradientRemoveBtn = document.getElementById("gradientRemoveBtn");
    gradientAddBtn.onclick = (e) => {
      let gr = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient;
      gr.gradients.push(JSON.parse(JSON.stringify(_templateGradient.gradients[0])));
      _currentlyLoaded.selectedGradient = gr.gradients.length-1;
      _currentlyLoaded.selectedGradientColor = 0;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    };
    gradientRemoveBtn.onclick = (e) => {
      let gr = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient;
      if(gr.gradients.length == 1) {
        GUI.instance.DisplayMessage("You can't have less than 1 gradient in this gradient group");
        return;
      }
      gr.gradients.splice(_currentlyLoaded.selectedGradient,1);
      _currentlyLoaded.selectedGradient = _currentlyLoaded.selectedGradient==0?0:_currentlyLoaded.selectedGradient-1;
      _currentlyLoaded.selectedGradientColor = 0;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);  
    };

    //choose which gradient to load
    let gradientSelectedSelect = document.getElementById("gradientSelectedSelect");
    gradientSelectedSelect.onchange = (e) => {
      console.log(_currentlyLoaded);
      let selected = e.target.selectedIndex;
      _currentlyLoaded.selectedGradient = selected;
      _currentlyLoaded.selectedGradientColor = 0;
      let selectedGradient = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient;
      updateGradientPreviewLeft(selectedGradient,selected,0);
    }
    //name gradient, also, kinda useless
    let nameGradientInput = document.getElementById("nameGradientInput");
    nameGradientInput.oninput = (e) => {
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.name = e.target.value;
    };
    //blend gradient 
    let blendSelect = document.getElementById("blendSelect");
    blendSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex].value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.blendMode = selected;
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    //type gradient
    let typeGradientSelect = document.getElementById("typeGradientSelect");
    typeGradientSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      if(selected.text.includes("radial")) {
        document.getElementById("shapeGradientContainer").style.display = "";
        document.getElementById("angleGradientContainer").style.display = "none";
        shapeSelect.selectedIndex = 0;
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].direction ="ellipse";
      } else {
        document.getElementById("shapeGradientContainer").style.display = "none";
        document.getElementById("angleGradientContainer").style.display = "";
        angleGradientInput.value = 0;
        angleGradientInputRange.value = 0;
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].direction = 0;
      }
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].type = selected.value;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }

    //angle gradient
    let angleGradientInput = document.getElementById("angleGradientInput");
    let angleGradientInputRange = document.getElementById("angleGradientInputRange");
    angleGradientInput.oninput = (e) => { 
      angleGradientInputRange.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].direction = e.target.value;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    angleGradientInputRange.oninput = (e) => { 
      angleGradientInput.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].direction = e.target.value;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    angleGradientInput.onchange = angleGradientInput.oninput;
    angleGradientInputRange.onchange = angleGradientInputRange.oninput;

    //shape gradient (radial)
    let shapeSelect = document.getElementById("shapeSelect");
    shapeSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex].value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].direction = selected;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    };

    //color in gradient
    let gradientColorInput = document.getElementById("changeColorGradientInput");
    var gradientColorPicker = new jsColor(gradientColorInput,{format:'hexa',
      previewPosition:'right',
      previewSize:30,
      backgroundColor:'rgba(0,0,0,0.9)',
      borderColor:'#343434',
      borderWidth:2});
    _colorPickers.push(gradientColorPicker);
    let colorGradientSelectedSelect = document.getElementById("colorGradientSelectedSelect");
    colorGradientSelectedSelect.onchange = (e) => {
      console.log(_currentlyLoaded);
      let selected = e.target.selectedIndex;
      let selectedGradient = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient];
      gradientColorPicker.fromString(selectedGradient.colors[selected]);
      if (positionGradientSelect.value == "Start at") {
        positionGradientInput.value = selectedGradient.positions[selected];
        positionGradientInputRange.value = selectedGradient.positions[selected];
      } else {
        positionGradientInput.value = selectedGradient.positions2[selected];
        positionGradientInputRange.value = selectedGradient.positions2[selected];        
      }
      _currentlyLoaded.selectedGradientColor = selected;
    };

    gradientColorInput.oninput = (e) => {
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].colors[_currentlyLoaded.selectedGradientColor] = gradientColorPicker.toHEXAString();
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }

    //color +/- button
    let colorGradientAddBtn = document.getElementById("colorGradientAddBtn");
    let colorGradientRemoveBtn = document.getElementById("colorGradientRemoveBtn");
    colorGradientAddBtn.onclick = (e) => {
      let gr = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient];
      gr.colors.push("#000000FF");
      gr.positions.push("");
      gr.positions2.push("");
      _currentlyLoaded.selectedGradientColor = gr.colors.length-1;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    colorGradientRemoveBtn.onclick = (e) => {
      let gr = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient];
      if(gr.colors.length == 2) {
        GUI.instance.DisplayMessage("You can't have less than 2 colors");
        return;
      }
      gr.colors.splice(_currentlyLoaded.selectedGradientColor,1);
      gr.positions.splice(_currentlyLoaded.selectedGradientColor,1);
      gr.positions2.splice(_currentlyLoaded.selectedGradientColor,1);
      _currentlyLoaded.selectedGradientColor = _currentlyLoaded.selectedGradientColor==0?0:_currentlyLoaded.selectedGradientColor-1;
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);      
    }

    //position color
    let positionGradientSelect = document.getElementById("positionGradientSelect");
    let positionGradientInput = document.getElementById("positionGradientInput");
    let positionGradientInputRange = document.getElementById("positionGradientInputRange");
    positionGradientSelect.onchange = (e) => {
      console.log(e.target.value);
      if(e.target.value == "Start at") {
        positionGradientInput.value = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions[_currentlyLoaded.selectedGradientColor];
        positionGradientInputRange.value = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions[_currentlyLoaded.selectedGradientColor];
      } else {
        positionGradientInput.value = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions2[_currentlyLoaded.selectedGradientColor];
        positionGradientInputRange.value = _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions2[_currentlyLoaded.selectedGradientColor];        
      }
    };
    positionGradientInput.oninput = (e) => {
      positionGradientInputRange.value = e.target.value;
      if(positionGradientSelect.value == "Start at") {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions[_currentlyLoaded.selectedGradientColor] = e.target.value;
      } else {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions2[_currentlyLoaded.selectedGradientColor] = e.target.value;
      }
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    positionGradientInputRange.oninput = (e) => {
      positionGradientInput.value = e.target.value;
      if(positionGradientSelect.value == "Start at") {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions[_currentlyLoaded.selectedGradientColor] = e.target.value;
      } else {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient.gradients[_currentlyLoaded.selectedGradient].positions2[_currentlyLoaded.selectedGradientColor] = e.target.value;
      }
      updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,_currentlyLoaded.selectedGradient,_currentlyLoaded.selectedGradientColor);
      updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
    }
    positionGradientInput.onchange = positionGradientInput.oninput;
    positionGradientInputRange.onchange = positionGradientInputRange.oninput;

    return tab;
  }

  function updateGradient(selected) {
    //might just remove the name
    //document.getElementById("nameGradientInput").value = selected;
    //document.getElementById("blendSelect").selectedIndex = blendModes.indexOf(selected.blendMode);
    //selected Gradient here
    //TODO
    //_currentGradientInfo
  }

  function updateGradientPreviewLeft(selectedGradient,displayedGradient,displayedColor) {
    document.getElementById("nameGradientInput").value = selectedGradient.name;
    document.getElementById("blendSelect").value = selectedGradient.blendMode;
    let gradientSelectedSelect = document.getElementById("gradientSelectedSelect");
    gradientSelectedSelect.options.length = 0;
    for (let i=0; i < selectedGradient.gradients.length; i++) {
      gradientSelectedSelect.options.add(new Option(i,i));
    }
    gradientSelectedSelect.selectedIndex = displayedGradient;
    document.getElementById("typeGradientSelect").value = selectedGradient.gradients[displayedGradient].type;
    if(selectedGradient.gradients[displayedGradient].type.includes("radial")) {
      document.getElementById("shapeSelect").value = selectedGradient.gradients[displayedGradient].direction;
      document.getElementById("shapeGradientContainer").style.display = "";
      document.getElementById("angleGradientContainer").style.display = "none";
    } else {
      document.getElementById("angleGradientInput").value = selectedGradient.gradients[displayedGradient].direction;
      document.getElementById("angleGradientInputRange").value = selectedGradient.gradients[displayedGradient].direction;
      document.getElementById("shapeGradientContainer").style.display = "none";
      document.getElementById("angleGradientContainer").style.display = "";      
    }
    let colorGradientSelectedSelect = document.getElementById("colorGradientSelectedSelect");
    colorGradientSelectedSelect.options.length = 0;
    for (let i=0; i < selectedGradient.gradients[displayedGradient].colors.length; i++) {
      colorGradientSelectedSelect.options.add(new Option(i,i));
    }    
    colorGradientSelectedSelect.selectedIndex = displayedColor;
    _colorPickers[2].fromString(selectedGradient.gradients[displayedGradient].colors[displayedColor]);
    if(document.getElementById("positionGradientSelect").value == "Start at") {
      document.getElementById("positionGradientInput").value = selectedGradient.gradients[displayedGradient].positions[displayedColor];
      document.getElementById("positionGradientInputRange").value = selectedGradient.gradients[displayedGradient].positions[displayedColor];
    } else {
      document.getElementById("positionGradientInput").value = selectedGradient.gradients[displayedGradient].positions2[displayedColor];
      document.getElementById("positionGradientInputRange").value = selectedGradient.gradients[displayedGradient].positions2[displayedColor];
    }

    //the preview
    let grad = selectedGradient.gradients[displayedGradient];
    let gradImg = `${grad.type}(`;
    gradImg += grad.type.includes("conic")?`from ${grad.direction}`:`${grad.direction}`;
    gradImg += grad.type.includes("radial")?",":"deg,";
    for (i in grad.colors) {
      gradImg+=`${grad.colors[i]} ${grad.positions[i]!=""?grad.positions[i]+"%":""} ${grad.positions2[i]!=""?grad.positions2[i]+"%":""},`;
    }
    gradImg = gradImg.slice(0,-1);
    gradImg += ")";
    document.getElementById("previewGradientContainer").style.backgroundImage = gradImg;
  }

  function updateGradientPreviewRight(selectedGradient) {
    let wordGradientPreviewBg = document.getElementById("wordGradientPreviewBg");
    let wordGradientPreviewText = document.getElementById("wordGradientPreviewText");
    let grad = "";
    for(i in selectedGradient.gradients) {
      grad += `${selectedGradient.gradients[i].type}(`;
      grad += selectedGradient.gradients[i].type.includes("conic")?`from ${selectedGradient.gradients[i].direction}`:`${selectedGradient.gradients[i].direction}`;
      grad += selectedGradient.gradients[i].type.includes("radial")?",":"deg,";
      for(j in selectedGradient.gradients[i].colors) {
        grad+=`${selectedGradient.gradients[i].colors[j]} ${selectedGradient.gradients[i].positions[j]!=""?selectedGradient.gradients[i].positions[j]+"%":""} ${selectedGradient.gradients[i].positions2[j]!=""?selectedGradient.gradients[i].positions2[j]+"%":""},`;
      }
      grad = grad.slice(0,-1);
      grad+="),";
    }
    grad = grad.slice(0,-1);
    wordGradientPreviewBg.style.backgroundImage=grad;
    wordGradientPreviewBg.style.backgroundBlendMode=selectedGradient.blendMode;
    wordGradientPreviewText.style.backgroundImage=grad;
    wordGradientPreviewText.style.backgroundBlendMode=selectedGradient.blendMode;
  }

  function createWordEffectsTab() {
    let tab = createElement("div","wordEffectsTab","createTab");
    let createWordEffectTabHTML = `
    <div id="wordOpacityContainer" class="tabWordContainer">
      <div id="wordOpacityLabel" class="gridLabel">Opacity (between 0 and 1):</div>
      <div id="wordOpacityInputContainer">
        <input id="wordOpacityInput" class="gridTextInput" placeholder="Opacity here, between 0 and 1" type="text">
        <input id="wordOpacityRange" placeholder="" type="range" min="0.01" max="1" step="0.01"></div>
    </div>
    <div id="wordRotationContainer" class="tabWordContainer">
      <div id="wordRotationLabel" class="gridLabel">Rotation between(in degrees):</div>
      <div id="wordRotationInputContainer">
        <input id="wordRotationInput1" class="gridTextInput" type="text" placeholder="Min here(Use deg)">
        <input id="wordRotationInput2" class="gridTextInput" type="text" placeholder="Max here(Use deg)">
      </div>
    </div>
    <div id="wordAnimationInputContainer" class="tabWordContainer">
      <div id="wordAnimationLabel" class="gridLabel">Animation/Additional properties (Anything in the 0 keyframe can be treated as an additional property):</div>
      <div id="wordAnimationContainer">
        <select id="wordAnimationSelect" class="selectContainer">
          <option>None</option>
          <option>Yes</option>
        </select>
        <div id="wordAnimationCreatorContainer" class="animationPreview" style="display: none;">
          <div id="preloadAnimationContainer" class="sideCreatorBox">
            <div id="preloadAnimationLabel" class="gradientLabel">Preload?</div>
            <select id="preloadAnimationSelect" class="selectContainer">
            </select>
          </div>
          <div id="nameAnimationContainer" class="sideCreatorBox">
            <div id="nameAnimationLabel" class="gradientLabel">Name?</div>
            <input id="nameAnimationInput" class="gradientTextInput" placeholder="Name here" type="text">
          </div>
          <div id="durationAnimationContainer" class="sideCreatorBox">
            <div id="durationAnimationLabel" class="gradientLabel">Duration?</div>
            <input id="durationAnimationInput" class="gradientTextInput" type="text" placeholder="(in milliseconds)">
          </div>
          <div id="iterationsAnimationContainer" class="sideCreatorBox">
            <div id="iterationsAnimationLabel" class="gradientLabel">Iterations?</div>
            <input id="iterationsAnimationInput" class="gradientTextInput" type="text" placeholder="Number">
            <input id="iterationsAnimationInputRange" class="gradientTextInput" placeholder="0" type="range" min="0" max="10">
          </div>
          <div id="easeAnimationContainer" class="sideCreatorBox">
            <div id="easeAnimationLabel" class="gradientLabel">Easing?</div>
            <select id="easeAnimationSelect" class="selectContainer">
              <option value="None">None</option>
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
            </select>
          </div>
          <div id="keyframeSelectedContainer" class="sideCreatorBox">
            <div id="keyframeSelectedLabel" class="gradientLabel">Selected Keyframe</div>
            <select id="keyframeSelectedSelect" class="selectContainer">                
              <option value="0">0</option>
            </select>
            <div id="animationBtnContainer" class="sideCreatorBox">
              <div id="keyframeAddBtn" class="gradientBtn">+</div>
              <div id="keyframeRemoveBtn" class="gradientBtn">-</div>
            </div>
          </div>
          <div id="paddingDown" class="sideCreatorBox" style="min-height: 10%;"></div>
        </div>
        <div id="wordAnimationPreviewContainer" class="animationPreview" style="display: none;">
        </div>
      </div>
    </div>
    `;
    tab.insertAdjacentHTML("beforeend",createWordEffectTabHTML);
    document.getElementById("tabsContainer").appendChild(tab);

    //opacity
    let wordOpacityInput = document.getElementById("wordOpacityInput");
    let wordOpacityRange = document.getElementById("wordOpacityRange");
    wordOpacityInput.oninput = (e) => {
      wordOpacityRange.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].opacity = e.target.value;
      wordOpacityInput.style.opacity = e.target.value;
    }
    wordOpacityRange.oninput = (e) => {
      wordOpacityInput.value = e.target.value;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].opacity = e.target.value;
      wordOpacityInput.style.opacity = e.target.value;
    }
    wordOpacityInput.onchange = wordOpacityInput.oninput;
    wordOpacityRange.onchange = wordOpacityRange.oninput;
    wordOpacityInput.onblur = (e) => {wordOpacityInput.style.opacity = "1";}
    wordOpacityRange.onblur = (e) => {wordOpacityInput.style.opacity = "1";}
    //rotation
    let wordRotationInput1 = document.getElementById("wordRotationInput1");
    let wordRotationInput2 = document.getElementById("wordRotationInput2");

    wordRotationInput1.oninput = (e) => {
      wordRotationInput1.style.transform = `rotate(${e.target.value}deg)`;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].rotation[0] = e.target.value;
    }
    wordRotationInput1.onchange = wordRotationInput1.oninput;
    wordRotationInput1.onblur = (e) => {
      wordRotationInput1.style.transform = "";
    }
    wordRotationInput2.oninput = (e) => {
      wordRotationInput2.style.transform = `rotate(${e.target.value}deg)`;
      _currentlyLoaded.values[_currentlyLoaded.selectedValue].rotation[1] = e.target.value;
    }
    wordRotationInput2.onchange = wordRotationInput2.oninput;
    wordRotationInput2.onblur = (e) => {
      wordRotationInput2.style.transform = "";
    }
    //animation
    let wordAnimationSelect = document.getElementById("wordAnimationSelect");
    wordAnimationSelect.onchange = (e) => {
      let selected = e.target.options[e.target.selectedIndex];
      let wordAnimationCreatorContainer = document.getElementById("wordAnimationCreatorContainer");
      let wordAnimationPreviewContainer = document.getElementById("wordAnimationPreviewContainer");
      if(selected.text == "None") {
        _currentlyLoaded.values[_currentlyLoaded.selectedValue].animation = "None";
        wordAnimationCreatorContainer.style.display = "none";
        wordAnimationPreviewContainer.style.display = "none";
      } else {
        if(_currentlyLoaded.values[_currentlyLoaded.selectedValue].animation == "None") {
          //_currentlyLoaded.values[_currentlyLoaded.selectedValue].animation = JSON.parse(JSON.stringify(_templateAnimation));
          _currentlyLoaded.selectedKeyframe = 0;
          _currentlyLoaded.selectedKeyframeValue = 0;
          //updateGradientPreviewLeft(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient,0,0);
          //updateGradientPreviewRight(_currentlyLoaded.values[_currentlyLoaded.selectedValue].gradient);
        }
        wordAnimationCreatorContainer.style.display = "";
        wordAnimationPreviewContainer.style.display = "";
      }
    }

    return tab;
  }

  function createWordPreviewTab() {
    let tab = createElement("div","wordPreviewTab","createTab");

    document.getElementById("tabsContainer").appendChild(tab);
    return tab;
  }

  function createImgBaseTab() {
    let tab = createElement("div","imgBaseTab","createTab");

    document.getElementById("tabsContainer").appendChild(tab);
    return tab;
  }

  function createImgEffectsTab() {
    let tab = createElement("div","imgEffectsTab","createTab");

    document.getElementById("tabsContainer").appendChild(tab);
    return tab;
  }

  function createImgPreviewTab() {
    let tab = createElement("div","imgPreviewTab","createTab");

    document.getElementById("tabsContainer").appendChild(tab);
    return tab;
  }

  function changeTabType(type) {
    //document.getElementById("create-tab-start").innerHTML="";
    //let hideAll = document.querySelectorAll(".createTab, .tabTitle");
    for (let i=0;i<_tabsContainers.length;i++) {
      _tabsContainers[i].style.display = "none"; 
      _tabsContainers[i].classList.remove("activeType");
      _tabsTitles[i].style.display = "none";
      _tabsTitles[i].classList.remove("activeType");
    }
    if(type=="word") {
      for(let i=0;i<4;i++) {
        _tabsTitles[i].style.display = "";
      }
      _tabsContainers[0].style.display = "";
      _tabsTitles[0].classList.add("activeType");
      _tabsTypes[0].classList.add("activeType");
      _tabsTypes[1].classList.remove("activeType");
    } else {
      for(let i=4;i<7;i++) {
        _tabsTitles[i].style.display = "";
      }
      _tabsContainers[4].style.display = "";
      _tabsTitles[4].classList.add("activeType");
      _tabsTypes[0].classList.remove("activeType");
      _tabsTypes[1].classList.add("activeType");
    }
  }

  function changeTab(whichTab) {
    for (let i=0;i<_tabsContainers.length;i++) {
      _tabsTitles[i].classList.remove("activeType");
      _tabsContainers[i].style.display = "none";
    }
    _tabsTitles[whichTab].classList.add("activeType");
    _tabsContainers[whichTab].style.display = "";
  }

  function emptyMainBox() {
    mainBox.innerHTML = "";
    _tabsTypes = [];
    _tabsTitles = [];
    _tabsContainers = [];
    _colorPickers = [];
    _currentlyLoaded = JSON.parse(JSON.stringify(_templateHypno));
    //var closeBtn = createElement("div","","button close");
    //closeBtn.onclick = () => { mainBox.remove(); };
    //mainBox.appendChild(closeBtn);
  }

  function rewrittenDropdownFunction(e) {
    /* The function in BMR, + hypno down there. Not replacing it like this in case I want to add more stuff to the menu
    const rect = document.getElementById("menu").getElementsByClassName("button")[0].getBoundingClientRect();
        DROPDOWN.instance.Open(e, [
          { label: "Inventory", onclick: () => MENU.Inventory.Open() },
          { label: "Macros", onclick: () => MENU.Macros.Open() },
          { label: "Messages", onclick: () => MENU.Messages.Open() },
          { label: "Myself", onclick: () => MENU.Myself.Open() },
          { label: "Profile", onclick: () => window.open(`/character/${GAME_MANAGER.instance.character.token}`) },
          { label: "Settings", onclick: () => MENU.Settings.Open() },
          { label: "Skills", onclick: () => MENU.Skills.Open() },
          { label: "Social", onclick: () => MENU.Social.Open() },
          { label: "Spells", onclick: () => MENU.Spells.Open({}) },
          { label: "Hypno", onclick: () => document.getElementById("menus").appendChild(startBmr())},
          { label: "Exit", onclick: () => this.ExitAlert() },
        ], rect.left, rect.bottom);
    */
   let _menuButton = document.getElementById("menu").getElementsByClassName("button")[0];
   let curFunc = _menuButton.onclick.toString(); 
   let newFunc = curFunc.substring(curFunc.indexOf("{")+1,curFunc.length-1);
   newFunc = newFunc.replace(/_menuButton/gm,'document.getElementById("menu").getElementsByClassName("button")[0]');
   let restOfTheFunc = 'MENU.Spells.Open({}) },\n{ label: "Hypno", onclick: () => document.getElementById("menus").appendChild(BMRHYPNO.start())}'
   newFunc = newFunc.replace(/MENU\.Spells\.Open\({}\) }/gm,restOfTheFunc);

   return new Function("e",newFunc);
  }

  function createElement(type = "div", id = "", className = "", innerHTML = "", placeholder = "") {
    let elm = document.createElement(type);
    elm.id = id;
    elm.className = className;
    elm.innerHTML = innerHTML;
    elm.placeholder = placeholder;
    return elm;
  }

  BMRHYPNO.start = startBmr;
  //testing jscolor
  jsColorScript=document.createElement('script');
  jsColorScript.src='https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.5.2/jscolor.min.js';
  jsColorScript.async=true;
  document.body.appendChild(jsColorScript);
  jsColorScript.onload = () => {
    GUI.instance.DisplayMessage("Everything was loaded correctly, hopefully! \\[T]/");
    jsColor = JSColor; 
  }

};

BMRHYPNO.load = bmrHypno;

console.log("testtttt");
/*-----------------------------
setName needed to remove intervals

type: img
value: url of the image/gif
opacity: ...
max-min width-height: ...
width-heigth: ...
transformRotation: ...
extra

type: word
value: "slut"
color: random OR an hex value chosen by color picker
opacity: value between 0 and 1(0 invisible, 1 totally visible
fontSize: random between two chosen values
fontType: ...nah
max-min width-height: ???? Probably adding text-wrap too
transformRotation: choose max deg and it will be between -deg and +deg
extra: an other css that you might want to add. simply parse it like: first line \n second line probably. trasform gets +
*/

/*
Animation example:

temp0.animate(
{
	color: ["red","orange","yellow","green","blue","indigo","violet"]
},
{
duration: 3000,
fill: "both"
}).onfinish = ()=>{alert(0)};
temp0.animate(
{
	top: ["0%","50%","100%","0%"]
},
{
duration: 3000,
fill: "both"
}).onfinish = ()=>{alert(55)};
*/