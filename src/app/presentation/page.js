"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { addDocument } from "@/db/addData";
import { getQuestions } from "@/db/fetchdata";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Loader,
  Mic,
  Paperclip,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
// "width: 700px; max-width: 100%; height: 450px"
const PresentationPage = () => {
  return (
    <TooltipProvider>
      <div className="h-screen w-full lg:flex justify-center items-center relative">
        <iframe
          src="https://gamma.app/embed/rnszwaeejeq5str"
          className="w-full h-full"
          allow="fullscreen"
          title="Firebase : Une Plateforme Cloud Puissante"
        ></iframe>
        <Discussion />
      </div>
    </TooltipProvider>
  );
};

export default PresentationPage;

export const Discussion = () => {
  const [questions, setQuestions] = useState([]);
  const [sending, setSending] = useState(false)
  const [question, setQuestion] = useState({
    pseudo : "",
    question : "",
    reponse : null
  })
  
  


  const toast = useToast();
  const fetchQuestions = async () => {
    const qs = await getQuestions();
    setQuestions(qs);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    console.log("questions", questions);
  }, [questions]);

  useEffect(() => {
    setTimeout(() => {
      console.log("tm", questions);
    }, 3000);
  }, [questions]);

  


  const handleSendMessage = async () => {
      if (!question.question) {
          toast.toast({
              title: "Question vide",
              description: "Veuillez entrer une question",
              variant: "destructive",
              position: "left",
          })
          return
      }
      setSending(true)
      if (question.pseudo == "") {
        setQuestion({
            ...question,
            pseudo : "Anonyme"
        })
      }
      await addDocument("Questions", question).then(() => {
          setSending(false)
          toast.toast({
              title: "Question envoye",
              description: "Nous vous repondrons dans les plus brefs delais",
              position: "left",
          })
          setQuestions([...questions, question])
          setQuestion({
              pseudo : "",
              question : "",
              reponse : ""
          })
      })
  }

  return (
    <div className="absolute top-6 right-6">
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" className="w-full justify-center">
            <FileQuestion className="mr-2 h-4 w-4" />
            Question
          </Button>
        </SheetTrigger>

        <SheetContent position="bottom" size="content">
          <SheetHeader className="-ms-2">
            <SheetTitle>Questions</SheetTitle>
            <SheetDescription>
              Toutes les questions seront prises en compte
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4 -ms-2">
          {
            questions.map((q)=>{
              return (
                  <QuestionCard key={q.id} q={q} />
              )
            })
          }

          </div>
          <SheetFooter className="absolute w-[90%] -ms-2 bottom-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring w-full flex flex-col gap-2"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="pseudo" className="sr-only">
                pseudo
              </Label>
              <Input value={question.pseudo} onChange={(e) => setQuestion({ ...question, pseudo: e.target.value })} name = "pseudo" type="text" id="pseudo" placeholder="Votre pseudo" />
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                name = "question"
                value={question.question}
                onChange={(e) => setQuestion({ ...question, question: e.target.value })}
                id="message"
                placeholder="Poser une question ...."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Envoyer
                  {sending && <Loader className="animate-spin mr-2 h-4 w-4" />}
                  {!sending && <Send className="size-4" />}
                </Button>
              </div>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};



const QuestionCard = ({ q }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
    open={isOpen}
    onOpenChange={setIsOpen}
    className="w-[350px] space-y-2"
    key={q?.id}
  >
    <Card>
        <CollapsibleTrigger>
      <CardHeader className="flex items-center flex-row justify-between">
        <div className="flex flex-col justify-start items-start">
          <CardTitle>{q.pseudo}</CardTitle>
          <CardDescription>
            {q?.question}
          </CardDescription>
        </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
      </CardHeader>
        </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent>
          <p className="bg-slate-100 p-4 rounded-md">
            {q?.reponse ? q.reponse : "Pas encore de reponse"}
          </p>
        </CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
  )
}