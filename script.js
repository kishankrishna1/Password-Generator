const inputSlider=document.querySelector("[data-length-slider]");
const lengthdisplay=document.querySelector("[data-length-number]");
const passwardDisplay = document.querySelector("[data-passward-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generate-btn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~!@#$%^&*()-_={[}];:"<,>.?/|';

let passward="";
let passward_length=10;
let checkcount=0;

handleSlider();
function handleSlider(){
    inputSlider.value = passward_length;
    lengthdisplay.innerText = passward_length;
}

function setIndicator(color, str){
    indicator.style.color = color;
    indicator.style.borderColor = color;
    indicator.innerText = str;
}

function getRandInteger(min, max){
   return  Math.floor(Math.random() * (max-min)) + min ; 
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65, 91));
} 

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passward_length>=8){
        setIndicator("#00ff15","Strong");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passward_length>=6){
        setIndicator("#ffff00","Average");
    }
    else{
        setIndicator("#ff0000","Weak");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwardDisplay.value);
        copyMsg.innerText = "copied"; 
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
        copyMsg.innerText ="";
    }, 1500);
}

inputSlider.addEventListener('input', (e)=>{
    passward_length = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwardDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){
    checkcount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked){
            checkcount++;
        }
    });
    if(passward_length <  checkcount){
        passward_length=checkcount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkBox)=>{
    checkBox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassward(array){
    for(let i=array.length-1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el)=>{str+=el});
    return str;
}

generateBtn.addEventListener('click', ()=>{
    if(checkcount<=0) return ;
    if(passward_length < checkcount){
        passward_length = checkcount;
        handleSlider();
    }

    passward="";
    


    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0; i<funcArr.length; i++){
        passward += funcArr[i]();
    }
    for(let i=0; i<passward_length - funcArr.length; i++){
        let randIndex=getRandInteger(0, funcArr.length);
        passward += funcArr[randIndex]();
    }

    passward = shufflePassward(Array.from(passward));

    passwardDisplay.value = passward;
    calcStrength();

});

// time = 02:05:00