"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge, ChevronDown, ChevronUp, CornerDownLeft, FileQuestion, Mic, Paperclip, Send } from "lucide-react";
import React from "react";
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
  const [isOpen, setIsOpen] = React.useState(false)
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
          <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <Card>
        <CardHeader className="flex items-center flex-row justify-between">
          <div>
          <CardTitle>lamottelymouhamed</CardTitle>
          <CardDescription>
            comment faire un bon code ?
          </CardDescription>
          </div>
          <CollapsibleTrigger>
          {
            isOpen
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />
          }
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <p> lorem ipsum dolor sit amet consectetur adipisicing elit .  lorem ipsum dolor sit amet consectetur adipisicing elit .lorem ipsum dolor sit amet consectetur adipisicing elit .lorem ipsum dolor sit amet consectetur adipisicing elit .lorem ipsum dolor sit amet consectetur adipisicing elit .</p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
            </div>
          <SheetFooter className="absolute w-[90%] -ms-2 bottom-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring w-full flex flex-col gap-2"
              x-chunk="dashboard-03-chunk-1"
            >
              <Label htmlFor="pseudo" className="sr-only">
                pseudo
              </Label>
              <Input
                type="text"
                id="pseudo"
                placeholder="Votre pseudo"
              />
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
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
                  <Send className="size-4" />
                </Button>
              </div>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
