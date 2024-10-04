import { Button, Box, ChakraProvider, Flex, Input, Text} from '@chakra-ui/react'
import './App.css'
import { useEffect, useState } from 'react'
import {useFormik} from 'formik'

type Result = {
  id: number
  start: string
  studio: string
  instructor: string
  program: string
  count: number
}

function App() {
  const [lastupdate, setLastUpdate] = useState<string>("")
  const [instructorranking, setInstructorRanking] = useState<Result[]>([])
  const [programranking, setProgramRanking] = useState<Result[]>([])
  const [searchword, setSearchWord] = useState<string>("")
  const [historyresult, setHistoryResult] = useState<Result[]>([])
  const formik = useFormik({
    initialValues: {
      action: "Program",
      keyword: "",
    },
    onSubmit: (val) => {
      console.log("Get Value.", val)
      getRecords()

      async function getRecords() {
        console.log(JSON.stringify(val))
        const response = await fetch('https://q23piaz1l1.execute-api.us-east-1.amazonaws.com',
          { // クロスオリジン対応
            //mode: "cors",  // クロスオリジンリクエストであることを指定
            //credentials: "include",
            // クロスオリジン対応(ここまで)
            method: "POST",
            body: JSON.stringify(val)
          }
        )
        const data = await response.json()
        console.log(data)
        setSearchWord(data.searchword)
        setHistoryResult(data.history)
      }
    }
  })
  const handlerActionChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("action", event.target.value)
  }

  useEffect(() => {
    getRecords()

    async function getRecords() {
      const jsonObject = {
        action: "First",
        keyword: "",
      }
      console.log(JSON.stringify(jsonObject))
      const response = await fetch('https://q23piaz1l1.execute-api.us-east-1.amazonaws.com',
        { // クロスオリジン対応
          //mode: "cors",  // クロスオリジンリクエストであることを指定
          //credentials: "include",
          // クロスオリジン対応(ここまで)
          method: "POST",
          body: JSON.stringify(jsonObject)
        }
      )
      const data = await response.json()
      console.log(data)
      setLastUpdate(data.lastupdate)
      setInstructorRanking(data.instructorranking)
      setProgramRanking(data.programranking)
    }
  }, [])

  return (
    <ChakraProvider>
      <div>
        <Text fontSize='4xl'>FEEL CYCLE Aggregate</Text>
        <div>
            <Text>LastLessonDate: {lastupdate}</Text>
        </div>
        <Box mb="16px">
          <div>
              <Text fontSize='2xl'>History Search</Text>
          </div>
          <form action="" onSubmit={formik.handleSubmit}>
              <div>
                <input
                    type="radio" 
                    id="action0" 
                    name="action" 
                    value="Program"
                    onChange={handlerActionChange}
                    checked={formik.values.action === "Program"}
                  />
                  Program
                  <input
                    type="radio" 
                    id="action1" 
                    name="action" 
                    value="Instructor"
                    onChange={handlerActionChange}
                    checked={formik.values.action === "Instructor"}
                  />
                  Instructor
              </div>
              <div>
                <Input placeholder='Input keyword' mb="4px"
                  type="text" 
                  id="keyword" 
                  name="keyword" 
                  value={formik.values.keyword} 
                  onChange={formik.handleChange}
                />
              </div>
            <Button colorScheme='blue' variant='solid' type="submit">Search</Button>
          </form>
          {historyresult.length > 0 &&
            <div>
              <Text fontSize='2xl'>Serach Result</Text>
              <Text>keyword : {searchword}</Text>
              <Text>count : {historyresult.length}</Text>
              {historyresult.map((data) => (
              <div key={data.id}>
                <Flex align="center" justifyContent="space-between">
                <Text>{data.start}</Text>
                <Text>{data.studio}</Text>
                <Text>{data.instructor}</Text>
                <Text>{data.program}</Text>
                </Flex>
              </div>
              ))}
            </div>
          }
        </Box>
        <Box mb="16px">
          <div>
            <Text fontSize='2xl'>INSTRUCTOR RANKING</Text>
            {instructorranking.map((data) => (
            <div key={data.id}>
              <Flex align="center" justifyContent="space-between">
                <Text>{data.instructor}</Text>
                <Text>{data.count}</Text>
              </Flex>
            </div>
            ))}
          </div>
        </Box>
        <Box mb="16px">
          <div>
            <Text fontSize='2xl'>PROGRAM RANKING</Text>
            {programranking.map((data) => (
            <div key={data.id}>
              <Flex align="center" justifyContent="space-between">
                <Text>{data.program}</Text>
                <Text>{data.count}</Text>
              </Flex>
            </div>
            ))}
          </div>
        </Box>
      </div>
    </ChakraProvider>
  )
}

export default App
