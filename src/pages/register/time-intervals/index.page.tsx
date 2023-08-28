import { Button, Checkbox, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { FormError, IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from "./styles";
import {  ArrowRight } from "phosphor-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/src/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/src/utils/covert-time-string-to-minutes";
import { api } from "@/src/lib/axios";

const EsquemadoformularioIntervalosdetempo = z.object({
 intervals: z.array(z.object({ // ja pra indicar q cada posicao do array é um objeto
    weekDay: z.number().min(0).max(6), // os objetos
    enabled: z.boolean(), // a escolha de clicar
    startTime: z.string(), 
    endTime: z.string()
 })
 ).length(7) // numero de dias da semana
 .transform((intervals) => intervals.filter(interval => interval.enabled)) // para modificar o formato do array, dessa forma retorna todos como true
 .refine((intervals) => intervals.length > 0, { // para ter pelo menos um dia da semana, assim nao consegui retorna sem ao menos um dia ativo
    message: 'Você precisa selecionar pelo menos um dia da semana!'
 })
 .transform(intervals => {
    return intervals.map(interval => {
        return {
            weekDay: interval.weekDay,
            startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
            endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
    })
  })
  .refine(intervals => {
    return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
  }, {
    message: 'O horário de termino deve ser pelo menos um 1h distante do inicio.'
  })
})

type intervalosDeTempoEntradaDeFormulario = z.input<typeof EsquemadoformularioIntervalosdetempo>
type intervalosDeTempoParaSaidaDeFormulario =z.output<typeof EsquemadoformularioIntervalosdetempo> // com isso ja envia o formulario com as datas

export default function TimeIntervals(){
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { isSubmitting, errors}
    } = useForm<intervalosDeTempoEntradaDeFormulario>({ // para a lista vim com um valor padrão
        resolver: zodResolver(EsquemadoformularioIntervalosdetempo), // para retorna os itens q esta desativado
        defaultValues: {
            intervals: [
                {weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00'}, // weekday: dia da semana, enable: chequebox, startTime: horario de inicio, endtime: horario final
                {weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00'},
                {weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00'}

            ],
        },
    })

    const weekDays = getWeekDays()

    const { fields } = useFieldArray({ // para manipular um campo do formulario q seja um array e mostra um conjunto com cada dia da semana
        control,
        name: 'intervals' // nome do campo q esta trabalhando
    })

    const intervals = watch('intervals')

    async function handleSetTimeIntervals(data: any){
        const {intervals} = data as intervalosDeTempoParaSaidaDeFormulario

        await api.post('/users/time-intervals', {
            intervals,
            
        })
    }

    return(
        <Container>
            <Header>
                <Heading as="strong">
                Quase lá
                </Heading>
                <Text>
                Defina o intervalo de horários que você está disponível em cada dia da semana.
                </Text>
                <MultiStep size={4} currentStep={3} />
            </Header>

            <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
                <IntervalsContainer>
                   {fields.map((field, index) => {
                    return(
                        <IntervalItem key={field.id}>
                        <IntervalDay>
                            <Controller
                                name={`intervals.${index}.enabled`}
                                control={control}
                                render={({field}) => {
                                    return (
                                        <Checkbox
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked === true)
                                        }}
                                        checked={field.value}
                                        />
                                    )
                                }}
                            />
                            <Text>{weekDays[field.weekDay]}</Text>
                        </IntervalDay>
                        <IntervalInputs>
                            <TextInput
                            size='sm'
                            type='time'
                            step={60} // por hora
                            disabled={intervals[index].enabled === false} // para deixa as horas alteravel ou não
                            {...register(`intervals.${index}.startTime`)}
                            />
                            <TextInput
                            size='sm'
                            type='time'
                            step={60} // por hora
                            disabled={intervals[index].enabled === false}
                            {...register(`intervals.${index}.endTime`)}

                            />
                        </IntervalInputs>
                    </IntervalItem>
                    )
                   })}
                   
                </IntervalsContainer>
                   {errors.intervals && (
                    <FormError size='sm'>{errors.intervals.message}</FormError>
                   )}
                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </IntervalBox>    
        </Container>
    )
}