import React, { useState, useEffect } from 'react';
import * as css from './style';

interface ClueType {
  id: number,
  question: string,
  answer: string,
  value: number,
  airdate: Date,
  dailyDouble: boolean,
  visited: boolean,
  category: {
    title: string,
  }
}

interface BoardProps {
  categoriesNum: number,
  cluesNum: number,
}

interface BoardState {
  loading: boolean,
  clues: ClueType[][],
  showClueDetails: boolean,
  selectedClue: ClueType | undefined,
  endPoints: string[],
  categoriesOffset: number,
  showResetConfirmation: boolean,
  visited: number[],
}

interface ClueProps extends ClueType{
  clickHandler: (id: number)=>void
}

interface ClueDetailsProps {
  question: string | undefined,
  answer: string | undefined,
  closeDetailsHandler: ()=>void,
}

interface ResetConfirmationProps {
  confirmHandler: ()=>void,
  closeHandler: ()=>void,
}

/**
 * Clue component
 * @param {number} prCluePropsops.id Value or price of the clue
 * @param {number} prCluePropsops.value Value or price of the clue
 * @param {function} ClueProps.clickHandler handler for handling interaction
 */
function Clue({ id, value, clickHandler, visited, dailyDouble = false }: ClueProps) {
  const printValue = !dailyDouble ? `${value}` : ``;
  return <css.ClueButton visited={visited} onClick={()=>{ clickHandler(id) }}> {printValue} </css.ClueButton>
}

/**
 * Clue details component in charge of rendering details for a clue
 * @param {string} ClueDetailsProps.question Question for the clue
 * @param {string} ClueDetailsProps.answer Answer for the clue
 * @param {string} ClueDetailsProps.closeDetailsHandler handler for closing the window
 */
function ClueDetails({ question, answer, closeDetailsHandler }: ClueDetailsProps) {
  const [state, setState] = useState({ showAnswer: false});
  const showAnswerHandler = () => {
    setState({...state, showAnswer: !state.showAnswer})
  }
  const closeHandler = () => {
    closeDetailsHandler();
  }

  return (
    <css.ClueDetails>
      <css.ClueText>
        {!state.showAnswer && question}
        {state.showAnswer && answer}
      </css.ClueText>
      <css.ClueDetailButtonsWrapper>
        <css.ClueDetailsShowButton onClick={showAnswerHandler}>
        {
         !state.showAnswer ? 'Show Answer' : 'Show Question'
        }
        </css.ClueDetailsShowButton>
        <css.ClueDetailsDoneButton onClick={closeHandler}>Done</css.ClueDetailsDoneButton>
      </css.ClueDetailButtonsWrapper>
    </css.ClueDetails>
  )
}

/**
 * Reset component in charge of rendering the confirmation window
 * @param {string} ClueProps.question Question for the clue
 * @param {string} ClueProps.answer Answer for the clue
 */
function ResetConfirmation({ confirmHandler, closeHandler}: ResetConfirmationProps) {
  return (
    <css.ResetConfirmation>
      <css.ClueText>
        Do you really want to reset?
      </css.ClueText>
      <css.ClueDetailButtonsWrapper>
        <css.ClueDetailsShowButton onClick={confirmHandler}>Yes</css.ClueDetailsShowButton>
        <css.ClueDetailsDoneButton onClick={closeHandler}>No</css.ClueDetailsDoneButton>
      </css.ClueDetailButtonsWrapper>
    </css.ResetConfirmation>
  )
}

/**
 * Loader component used at start
 */
function Loader () {
  return (
    <css.Loader> Loading... </css.Loader>
  );
}

/**
 * Board component in charge of rendering all the clues and details panel
 * @param {number} BoardProps.categoriesNum Question for the clue
 * @param {number} BoardProps.cluesNum Answer for the clue
 */
const Board = ({ categoriesNum, cluesNum }:BoardProps) => {
  const [state, setState] = useState<BoardState>({
    loading: true,
    categoriesOffset: 0,
    clues: [],
    showClueDetails: false,
    showResetConfirmation: false,
    selectedClue: undefined,
    endPoints: [],
    visited: [],
  });

  useEffect(() => {
    loadData().then((data:ClueType[][]) => {
      resetBoard(data);
    });
  },[state.categoriesOffset])

  function clickHandler(id:number) {
    let clue: ClueType | undefined;

    for (let i=0; i<state.clues.length; i++) {
      clue = state.clues[i].filter((clue: ClueType) => clue.id === id).shift();
      if (clue) break;
    }
    const newVisited:number[] = state.visited.slice();
    newVisited.push(id);
    setState({...state, showClueDetails: true, selectedClue: clue, visited: newVisited});
  }

  const closeHandler = () => {
    setState({...state, showClueDetails: false});
  }

  const getEndPoint = (categoryNum: number) => {
    return `http://jservice.io/api/clues?category=${categoryNum}`;
  };

  const loadData = () => {
    let endpoints:string[] = [];
    for (let i=0; i<categoriesNum+1; i++) {
      endpoints[i] = getEndPoint(i + state.categoriesOffset);
    }
    return Promise.all(endpoints.map((ep) => {
      return fetch(ep);
    })).then(responsesData => {
      return Promise.all(responsesData.map((response) => {
        return response.json();
      }));
    }).then ((data) => {
      return data;
    });
  }

  const toggleConfirmHandler = () => {
    setState({...state, showResetConfirmation: true});
  }
  const resetHandler = () => {
    setState({...state, categoriesOffset: state.categoriesOffset + categoriesNum });
  }

  const resetBoard = (data: ClueType[][]) => {
    const filteredData: ClueType[][] = data.filter((clueArray) => clueArray.length);
    let cluesData:ClueType[][] = [];
    
    for (let i=0; i<categoriesNum; i++) {
      const dailyDoubleProb:boolean = Math.floor((Math.random() * 100) + 1) < 5 ? true : false;
      const dailyDoublePos:number = Math.floor((Math.random() * cluesNum));
      const column:ClueType[] = filteredData[i].filter((clue) => clue.value ).slice(0, cluesNum);

      // If element present set the daily double value
      if (typeof column[dailyDoublePos] !== 'undefined') column[dailyDoublePos].dailyDouble = dailyDoubleProb;

      cluesData.push(column);
    }

    setState({...state, clues: cluesData, loading: false, visited:[], showResetConfirmation: false});
  }

  if (state.loading) return <Loader/>;

  return (
    <css.Page>
      <css.PageContent>
      {
        state.clues.map((clueColumn) => {
          const columnTitle = clueColumn[0]?.category.title;
          const column = clueColumn.map((clue: ClueType, index: number) => {
            const visited = state.visited.includes(clue.id);
            return <Clue key={index} {...clue} clickHandler={clickHandler} visited={visited}/>
          })

          return (
          <css.BoardColumn>
            <css.BoardColumnTitle>
              {columnTitle}
            </css.BoardColumnTitle>
            {column}
          </css.BoardColumn>)
        })
      }
      {
        state.showClueDetails && <ClueDetails closeDetailsHandler={closeHandler} question={state.selectedClue?.question} answer={state.selectedClue?.answer}/>
      }
      {
        state.showResetConfirmation && <ResetConfirmation confirmHandler={resetHandler} closeHandler={()=>{setState({...state, showResetConfirmation: false})}}/>
      }
      </css.PageContent>
      <css.ResetButton onClick={toggleConfirmHandler}>Reset</css.ResetButton>
    </css.Page>
  );
}

const JeopardyGame = () => {
  return (
    <Board categoriesNum={6} cluesNum={5} />
  );
}

export default JeopardyGame;
