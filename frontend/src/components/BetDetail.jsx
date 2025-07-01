function BetDetail({ bet }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.choice.value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                <legend><h1>{ bet.bet_text }</h1></legend>
                    <h3>Win Probablity: { Math.ceil(bet.win_probability*100) }%</h3>
                    {bet.choices.map((choice) => (
                        <div key={choice.id}>
                            <input type='radio' name={`choice${choice.id}`} id={`choice${choice.id}`} value={`${choice.id}`} />
                            <label htmlFor={`choice${choice.id}`}>{choice.choice_text}  {choice.amount}</label>
                            <br />
                        </div>
                    ))}
                    <label htmlFor="amount">Bet Amount:</label>
                    <input type="text" name="amount" id="amount" />
                </fieldset>
                <input type="submit" value="Bet" />
            </form>
        </div>
    )
}

export default BetDetail;