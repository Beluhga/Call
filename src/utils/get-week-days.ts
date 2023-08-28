export function getWeekDays(){
    const formatter = new Intl.DateTimeFormat('pt-BR', {weekday: 'long'}) // para colocar os dias da semana

    return Array.from(Array(7).keys()) // cria uma array com sete posições, transforma em uma estrutura interavel, usando a key da pra trabalhar com a array
    .map(day => formatter.format(new Date(Date.UTC(2023, 8, day))) // formando com o dia e o mes e retorna a semana corretamente
    ).map(weekDay => {
        return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))// para colocar a primeira letra em letra maiuscula
    })
}