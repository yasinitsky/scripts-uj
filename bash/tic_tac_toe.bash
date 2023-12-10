SAVE_FOLDER=~/.tictactoe
SAVE_FILE=save

board_init() {
    for i in {0..8}
    do
        BOARD[$i]=" "
    done
}

board_print_state() {
    for i in {0..2}
    do
        echo "-------------"
        for j in {0..2}
        do
            let "index=i*3+j"
            local value=${BOARD[$index]} 
            echo -n "| "
            if [[ $value == "X" ]]; then
                echo -n -e "\e[1;32m${value}\e[0m"
            elif [[ $value == "O" ]]; then
                echo -n -e "\e[1;94m${value}\e[0m"
            else
                echo -n "${index}"
            fi
            echo -n " "
        done
        echo "|"
    done
    echo "-------------"
}

board_make_move() {
    local player=$1
    local move=$2

    if ! [[ $move =~ ^[0-9]$ ]]; then
        echo "Wrong move. Try Again."
        return 1
    fi

    if [[ ${BOARD[$move]} != " " ]]; then
        echo "There is already a symbol in this cell. Choose another one."
        return 1
    fi

    if (( player == 0 )); then
        BOARD[$move]="X"
    else
        BOARD[$move]="O"
    fi

    return 0
}

player_switch() {
    local player=$1
    if (( player == 0 )); then
        echo 1
    else
        echo 0
    fi
}

board_check_win() {
    for i in {0..2}
    do
        if [[ ${BOARD[$i]} == ${BOARD[$i+3]} && ${BOARD[$i]} == ${BOARD[$i+6]} && ${BOARD[$i]} != " " ]]; then
            echo ${BOARD[$i]}
            return
        fi
    done

    for i in 0 3 6
    do
        if [[ ${BOARD[$i]} == ${BOARD[$i+1]} && ${BOARD[$i]} == ${BOARD[$i+2]} && ${BOARD[$i]} != " " ]]; then
            echo ${BOARD[$i]}
            return
        fi
    done

    if [[ ${BOARD[0]} == ${BOARD[4]} && ${BOARD[0]} == ${BOARD[8]} && ${BOARD[0]} != " " ]]; then
        echo ${BOARD[0]}
        return
    fi

    if [[ ${BOARD[2]} == ${BOARD[4]} && ${BOARD[2]} == ${BOARD[6]} && ${BOARD[2]} != " " ]]; then
        echo ${BOARD[2]}
        return
    fi
}

board_save_state() {
    local dirname=$SAVE_FOLDER
    local filename=$SAVE_FILE
    if ! [[ -d $dirname ]]; then
        mkdir $dirname
    fi

    echo -n "" > "$dirname/$filename"

    for i in {0..8}
    do
        echo -n "${BOARD[i]}" >> "$dirname/$filename"
    done
}

board_load_state() {
    local dirname=$SAVE_FOLDER
    local filename=$SAVE_FILE
    if ! [[ -f $dirname/$filename ]]; then
        echo "You don't have saved games."
        exit
    fi

    local line=$(head -n 1 $dirname/$filename)
    local moves=0
    for i in {0..8}
    do
        let "moves++"
        BOARD[i]=${line:$i:1}
    done

    rm -f $dirname/$filename

    return $moves
}

select_random_move() {
    local possible_moves=""
    for i in {0..8}
    do
        if [[ ${BOARD[$i]} == " " ]]; then
            possible_moves+=$i
        fi
    done

    echo ${possible_moves:$(( 0 + $RANDOM % (${#possible_moves} -1) )):1}
}

main() {
    board_init

    echo "Welcome to the \"Tic Tac Toe\" game!"
    echo "1. New Player vs Player game"
    echo "2. Load saved Player vs Player game"
    echo "3. New Player vs Stupid Computer game"

    local option=""
    local move=""
    local player=0
    local move_counter=0

    read -p "Choose option: " option
    case $option in
        1)
            echo -e "\nThe first move is made by the cross.\nEach free cell in the game is marked with a number.\nEnter a number to make a move or 'S' to save the game."
            ;;
        2)
            board_load_state
            move_counter=$?
            if (( move_counter % 2 == 0 )); then
                player=0
            else
                player=1
            fi
            ;;
        3)
            ;;
        *)
            echo "Bad option. Exiting..."
            exit
            ;;
    
    esac

    board_print_state

    while true
    do
        if [[ $option == "3" && $player == "1" ]]; then
            move=$(select_random_move)
        else
            read -p "Make your move: " move
        fi

        if [[ $move == "S" && $options != "3" ]]; then
            board_save_state
            exit
        fi

        board_make_move $player $move

        local result=$?
        if (( result == 0 )); then
            player=$(player_switch $player)

            let "move_counter++"
        fi

        board_print_state
        
        local winner=$(board_check_win)
        if [[ -n $winner ]]; then
            echo "Game Over. $winner wins."
            exit 0
        fi

        if (( move_counter == 9 )); then
            echo "Game Over. Draw."
            exit 0
        fi

    done
}

main