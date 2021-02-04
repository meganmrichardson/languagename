import ohm from "ohm-js";

const medleyGrammar = ohm.grammar(String.raw`
  Medley {
    Program    = Statement*
    Statement  = Function                              
               | Assignment
               | Reassign
               | Declaration
               | Conditional
               | WLoop
               | FLoop
               | Print
               | Return
               | Call "|"                              --call
               | Increment "|"                         --increment
               | Comment
               | Array
               | Dictionary
    Assignment = stringberry id (is (strLit | noneLit)) "|"
               | intberry id (is (intLit | noneLit)) "|"
               | floatberry id (is (floatLit | noneLit)) "|"
               | boolberry id (is (boolLit | noneLit)) "|"
    Declaration= stringberry id "|"
               | intberry id "|"
               | floatberry id "|"
               | boolberry id "|"
    Reassign   = id (is Exp) "|"
    Array      = berrybasket "~"stringberry"~" id is "~"ListOf<strLit, ";">"~" "|"
               | berrybasket "~"intberry"~" id is "~"ListOf<intLit, ";">"~" "|"
               | berrybasket "~"floatberry"~" id is "~"ListOf<floatLit, ";">"~" "|"
               | berrybasket "~"boolberry"~" id is "~"ListOf<boolLit, ";">"~" "|"
    Dictionary = fruitbasket "~"type"," type"~" id is "~"ListOf<DictContent, ";"> "~" "|"
    DictContent= Literal "," Literal
    Conditional= ifmelon Exp Block (elifmelon Exp Block)*
                 (elsemelon Block)?
    WLoop      = whilemelon Exp Block
    FLoop      = formelon ((Assignment)? (Exp "|")? Increment?) Block
    Block      = "->"Statement*"<-"
    Function   = blend id "(" Params ")" Block
    Print      = juice Exp "|"
    Return     = squeeze Exp "|"
    Call       = id "(" Args ")"
    Args       = ListOf<Exp, ",">
    Params     = type id ("," type id)*
    Exp        = Exp orange Exp2                          --binary
               | Exp2
    Exp2       = Exp2 apple Exp3                          --binary
               | Exp3
    Exp3       = Exp3 relop Exp4                          --binary
               | Exp4
    Exp4       = Exp4 addop Exp5                          --binary
               | Exp5
    Exp5       = Exp5 mulop Exp6                          --binary
               | Exp6
    Exp6       = Exp7 power Exp6                          --binary
               | Exp7
    Exp7       = prefix Exp8                              --unary
               | Exp8
    Exp8       = Call
               | Literal
               | id
               | "(" Exp ")"                              --parens                         
    Increment  = id ("++" | "--")
    Literal    = strLit
               | intLit
               | floatLit
               | boolLit
    strLit     = "\"" (~"\\" ~"\"" any | escape)* 
                 "\""
    intLit     = digit+
    floatLit   = digit+ ("." digit+)?
    boolLit    = "organic" | "gmo"
    noneLit    = "none"
    blend      = "blend" ~alnum
    juice      = "juice" ~alnum
    let        = "let" ~alnum
    stringberry= "stringberry" ~alnum
    intberry   = "intberry" ~alnum
    floatberry = "floatberry" ~alnum
    boolberry  = "boolberry" ~alnum
    orange     = "orange" ~alnum
    apple      = "apple" ~alnum
    less       = "less" ~alnum
    more       = "more" ~alnum
    lesseq     = "less equals" ~alnum
    moreeq     = "more equals" ~alnum
    equals     = "equals" ~alnum
    times      = "times" ~alnum
    divby      = "divby" ~alnum
    mod        = "mod" ~alnum
    plus       = "plus" ~alnum
    minus      = "minus" ~alnum
    power      = "to the power of" ~alnum
    is         = "is" ~alnum
    berrybasket= "berrybasket" ~alnum
    fruitbasket= "fruitbasket" ~alnum
    ifmelon    = "ifmelon" ~alnum
    elifmelon  = "elifmelon" ~alnum
    elsemelon  = "elsemelon" ~alnum
    whilemelon = "whilemelon" ~alnum
    formelon   = "formelon" ~alnum
    squeeze    = "squeeze" ~alnum
    relop      = "less" | "more" | "less equals" | "more equals" | "equals"
    mulop      = "times" | "divby" | "mod"
    addop      = "plus" | "minus"
    prefix     = "-" | "not"
    escape      =  "\\" ("\\" | "\"" | "n")                      -- simple
    type       = stringberry | intberry | floatberry | boolberry
    keyword    = let | juice | blend | orange | apple | less | more
               | lesseq | moreeq | equals | times | divby | mod
               | plus | minus | power | is | berrybasket | fruitbasket
               | ifmelon | elifmelon | elsemelon | whilemelon | elsemelon
               | squeeze
    id         = ~keyword letter alnum*
    Comment    = "::" (~"\n" any)* ("\n" | end)
               | ":::" (~"\n" any)* ":::"
  } 
`);

export default function parse(source) {
  const match = medleyGrammar.match(source);
  return match.succeeded();
}
