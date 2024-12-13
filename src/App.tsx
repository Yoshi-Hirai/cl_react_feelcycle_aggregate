//import { Button, Box, ChakraProvider, Flex, Input, Text, Table, Tr, Th, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import {Button, Box, ChakraProvider, Flex, Input, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
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

type Totalling = {
  id: number
  item: string
  count: number
  value: number
}

type WesternTotalling = {
  westerncalender : string
  totalinformation : Totalling[]
}

function App() {
  const [lastupdate, setLastUpdate] = useState<string>("")
  const [instructorranking, setInstructorRanking] = useState<Result[]>([])
  const [programranking, setProgramRanking] = useState<Result[]>([])
  const [programcategorytotalling, setProgramCategoryTotalling] = useState<Totalling[]>([])
  const [isgroup, setIsGroup] = useState<boolean>(false)
  const [searchword, setSearchWord] = useState<string>("")
  const [historyresult, setHistoryResult] = useState<Result[]>([])
  const [westernyearinstructortotalling, setWesternYearInstructorTotalling] = useState<WesternTotalling[]>([])
  const [westernyearprogramtotalling, setWesternYearProgramTotalling] = useState<WesternTotalling[]>([])

  const getProgramColor = (program: string) => {
    if(!program.indexOf("BB3")) {
      return "red"
    }
    else if(!program.indexOf("BSBi")) {
      return "#4A6B64"
    }
    else if(!program.indexOf("BSWi")) {
      return "#A000A0"
    }
    else if(!program.indexOf("BB2")) {
      return "orange"
    }
    else if(!program.indexOf("BB1")) {
      return "#FBE000"
    }
    else if(!program.indexOf("BSL")) {
      return "blue"
    }
    else if(!program.indexOf("BSB")) {
      return "#52BCDE"
    }
    else if(!program.indexOf("BSW")) {
      return "#D190DC"
    }
  }

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
        const response = await fetch('https://y473x6lzgmrkj4wg4uwx3kmavm0hhfda.lambda-url.us-east-1.on.aws/',
          { // クロスオリジン対応
            mode: "cors",  // クロスオリジンリクエストであることを指定
            // クロスオリジン対応(ここまで)
            method: "POST",
            body: JSON.stringify(val)
          }
        )
        const data = await response.json()
        console.log(data)
        setIsGroup(data.isgroup)
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
      const response = await fetch('https://y473x6lzgmrkj4wg4uwx3kmavm0hhfda.lambda-url.us-east-1.on.aws/',
        { // クロスオリジン対応
          mode: "cors",  // クロスオリジンリクエストであることを指定
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
      setProgramCategoryTotalling(data.programcategorytotalling)
      setWesternYearInstructorTotalling(data.westerninstructortotalling)
      setWesternYearProgramTotalling(data.westernprogramtotalling)
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
                <input
                  type="checkbox"
                  name="isGroup"
                  onChange={() => formik.setFieldValue("isGroup", !formik.values.isGroup)}
                />
                GROUPING                
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
              {isgroup
                ? <div>true</div>
                : <div>false</div>
              }
              {historyresult.map((data) => (
                <div key={data.id}>
                  {!isgroup
                    ?
                      <Flex align="center" justifyContent="space-between">
                        <Box w='100%'>
                          <Text>{data.start}</Text>
                        </Box>
                        <Box w='100%'>
                          <Text>{data.studio}</Text>
                        </Box>
                        <Box as='b' w='100%'>
                          <Text>{data.instructor}</Text>
                        </Box>
                        <Box bg={getProgramColor(data.program)} w='100%'>
                          <Text as='b'>{data.program}</Text>
                        </Box>
                      </Flex>
                    :
                      <Flex align="center" justifyContent="space-between">
                        <Box as='b' w='100%'>
                          <Text>{data.instructor}</Text>
                        </Box>
                        <Box bg={getProgramColor(data.program)} w='100%'>
                          <Text as='b'>{data.program}</Text>
                        </Box>
                        <Box w='100%'>
                          <Text>{data.count}</Text>
                        </Box>
                      </Flex>
                  }
                </div>
              ))}
            </div>
          }
        </Box>

        <Flex align="center" justifyContent="space-between" gap="32px">
          <Box mb="16px">
            <div>
              <Text fontSize='2xl'> INSTRUCTOR RANKING </Text>
              {instructorranking.map((data) => (
              <div key={data.id}>
                <Flex align="center" justifyContent="space-between">
                  <Box w='100%'>
                    <Text as='b'>{data.instructor}</Text>
                  </Box>
                  <Box w='100%'>
                    <Text as='b'>{data.count}</Text>
                  </Box>
                </Flex>
              </div>
              ))}
            </div>
          </Box>
          <Box mb="16px">
            <div>
              <Text fontSize='2xl'> PROGRAM RANKING </Text>
              {programranking.map((data) => (
              <div key={data.id}>
                <Flex align="center" justifyContent="space-between">
                  <Box bg={getProgramColor(data.program)} w='100%'>
                    <Text as='b'>{data.program}</Text>
                  </Box>
                  <Box w='100%'>
                    <Text as='b'>{data.count}</Text>
                  </Box>
                </Flex>
              </div>
              ))}
            </div>
          </Box>
        </Flex>
        <Flex>
          <Box mb="16px">
            <div>
              <Text fontSize='2xl'>PROGRAM CATEGORY TOTAL</Text>
              {programcategorytotalling.map((data) => (
              <div key={data.id}>
                <Flex align="center" justifyContent="space-between">
                  <Box bg={getProgramColor(data.item)} w='100%'>
                    <Text as='b'>{data.item}</Text>
                  </Box>
                  <Box w='100%'>
                    <Text as='b'>{data.count}</Text>
                  </Box>
                  <Box w='100%'>
                    <Text as='b'>{data.value}%</Text>
                  </Box>
                </Flex>
              </div>
              ))}
            </div>
          </Box>
        </Flex>
{/*
        <Table>
          <Tr>
            {programcategorytotalling.map((data) => (
              <Th bg={getProgramColor(data.item)} width='{data.value}%'>{data.item}</Th>
            ))}
          </Tr>
        </Table>
*/}
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            {westernyearinstructortotalling.map((data) => (
              <div key={data.westerncalender}>
                <Tab>{data.westerncalender}</Tab>
              </div>
            ))}
          </TabList>
          <TabPanels>
            {westernyearinstructortotalling.map((data, i) => (
                <div>
                  <TabPanel>
                    {data.totalinformation.map((data2, j) => (
                      <div key={data2.id}>
                        <Flex>
                          <Box w='100%'>
                            <Text as='b'>{data2.item}</Text>
                          </Box>
                          <Box w='100%'>
                            <Text>{data2.count}</Text>
                          </Box>
                          <Box bg={getProgramColor(westernyearprogramtotalling[i].totalinformation[j].item)}w='100%'>
                            <Text as='b'>{westernyearprogramtotalling[i].totalinformation[j].item}</Text>
                          </Box>
                          <Box w='100%'>
                            <Text>{westernyearprogramtotalling[i].totalinformation[j].count}</Text>
                          </Box>
                        </Flex>
                      </div>
                    ))}
                  </TabPanel>
                </div>
              ))}
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  )
}

export default App
