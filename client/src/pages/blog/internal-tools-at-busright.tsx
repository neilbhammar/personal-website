import { BlogLayout } from "@/components/blog-layout";
import { Project } from "@/data/projects";

interface BlogPostProps {
  project: Project;
}

export default function InternalToolsBlog({ project }: BlogPostProps) {
  return (
    <BlogLayout project={project}>
      <div className="space-y-12">
        {/* Introduction */}
        <section>
          <p className="text-muted-foreground">
            Over my five and a half years at BusRight running Ops & CX, I built a ton of internal tools—maybe even hundreds. Some of them were quick automations, some were full-blown internal apps, and most of them were just ways to make our team a little bit more effective.
          </p>
          <p className="text-muted-foreground mt-4">
            I spent a lot of time jumping between Notion and Coda documentation, Zapier for automation, and Replit (later Cursor) for coding small tools to fill in the gaps with AI code generation tools. While most of these were purely internal, there are a few that were public (or publically referenced) that I can share, so I figured I'd reflect on them here.
          </p>
        </section>

        {/* ROI Calculator Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">ROI Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">The Problem</h3>
                <p className="text-muted-foreground">
                  On December 23rd, Keith, our CEO, shot me a message asking if I could put together an ROI calculator spreadsheet for our sales team. It was something on someone's backlog somewhere, but it never quite made it to the top of the priority list.
                </p>
                <p className="text-muted-foreground mt-4">
                  The ROI of BusRight was always pretty clear to transportation departments, but we had an opportunity to make the numbers incredibly clear to executive stakeholders, too, in a more comprehensive way. Instead of just putting together a spreadsheet, I figured I'd take a shot and going a step further.
                </p>
              </div>
            </div>
            <img 
              src="/images/blog/roi-calculator.png"
              alt="ROI Calculator Interface"
              className="rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">The Process</h3>
              <p className="text-muted-foreground">
                I started by defining the actual ROI calculation. Before worrying about how it looked, I wanted to be sure we had the right business logic. I ran the numbers, got input from stakeholders, crafted mini case studies from quotes, and finalized the key inputs that would drive the formulas.
              </p>
              <p className="text-muted-foreground mt-4">
                From there, after browsing ROI calculators in dribbble for inspiration, I threw together a rough layout in Figma—just enough to get a sense of what was in my head. I tossed it to v0 to refine and start bringing a more hi-fi version of my vision to life. I probably spent way more time refining things and tweaking them in v0 than I should have, especially given that I knew I wanted to actually build the tool using Replit. I learned that the hard-way, but the instant gratification of prompt-see changes-prompt again, etc. was so gratifying (and frustrating when it didn't work). It was a really phenomenal way, though, to test out different potential layouts and page structures for the ROI calculator.
              </p>
              <p className="text-muted-foreground mt-4">
                Once I felt like I had a solid general sense of direction and key basic requirements, I switched to Replit. For the first 80%, using Replit's agent felt super smooth and worked incredibly well. Refinements with the "assistant" were a little trickier. I'm not technical, but I was keen on understanding how the code was structured and why it was structured the way it was and where different functions lived and how they worked. I found myself constantly asking the agent and assistant to comment out the code and explain how different parts were structured so I could make smaller edits on my own, whether it was adjusting colors or tweaking box sizes. I also used the chat pretty extensively for the same purpose. Huge learning boost.
              </p>
              <p className="text-muted-foreground mt-4">
                Over time, I started to get a deeper understanding of how different pieces of the React app worked, down to specific syntax details. That was harder than I thought it'd be, but honestly one of the most rewarding parts of the build.
              </p>
              <p className="text-muted-foreground mt-4">
                I kept the first iteration (&lt;3 hours) pretty simple - ROI Calculator with set formulas and customizable basic inputs to those formulas. It looked - visually - WAY better than I had originally planned for, which was nice. I then started to dream a bit with potential features and built out the final product within 24 hrs.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">The Final Product</h3>
              <p className="text-muted-foreground">The tool let users:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Adjust key inputs (fleet size, driver count, daily routes) to see how BusRight's ROI played out. This included hidden variables/formula inputs outside of the main 3 in case our sales team needed to make changes.</li>
                <li>View and tweak underlying formulas with a 'Show Formula' button w/links to case studies.</li>
                <li>Share customized versions with a simple copy URL button (all saved in the URL params)</li>
                <li>Download a PDF version for easy sharing.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                I shared it with the sales team the next day as their holiday gift and got some awesome reactions + feedback (quickly made some tweaks and added new features based on that).
              </p>
              <p className="text-muted-foreground mt-4">
                Within two months, the team had used it over 150 times. This was one of my favorite quick builds—not just because I learned a ton, but because it was the first time something I built was being used beyond just our team. Seeing prospects interact with it was a pretty cool feeling.
              </p>
            </div>
          </div>
        </section>

        {/* Voice AI Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Voice AI CSP/CRM Tool</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">The Problem</h3>
                <p className="text-muted-foreground">
                  Every 30 days, I required all customer account owners (myself included) to document a CXM pulse (healthy, concerning, or poor) along with a title and explanation to our Customer Success Platform (Vitally). These account owner pulses were a major contributor to our health scores in Vitally given our high-touch, concierge model.
                </p>
                <p className="text-muted-foreground mt-4">
                  The problem? Vitally didn't have a mobile app, and logging these updates manually on the web app, felt slow and tedious (because it was a custom object that didn't have keyboard shortcuts, etc.). A lot of times, I'd be making these updates right after a slew of customer check-in phone calls, and having to sit at my computer to do it felt unnecessary. My ideal workflow was simple:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                  <li>Make a bunch of quick check-in calls while on a walk.</li>
                  <li>Dictate updates immediately, hands-free.</li>
                  <li>Have them auto-log into Vitally.</li>
                </ul>
              </div>
            </div>
            <img 
              src="/images/blog/voice-ai-pulse-tool.png"
              alt="Voice AI Tool Interface"
              className="rounded-lg shadow-lg w-2/3 mx-auto"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">The Process</h3>
              <p className="text-muted-foreground">
                I jimmied together a voice-based mobile tool to make this happen. This was before Replit and other coding tools released Agents, so it was a lot of me and ChatGPT collaborating (and yelling at eachother).
              </p>
              <p className="text-muted-foreground mt-4">
                I had a ton of fun having to define the business logic & general workflow that this tool would require to be effective. It was a good reminder that good engineering is probably 80% critical thinking and planning and 20% syntax and execution. I didn't give two hoots about design on this one (okay maybe one hoot, though at first I found myself in a trap of trying to design the most beautiful form, which was a little dumb).
              </p>
              <p className="text-muted-foreground mt-4">
                OK — so I needed a tool that:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Transcribed my voice</li>
                <li>Took that transcription and turned it into a structured object (JSON) with the relevant fields</li>
                <li>Could - based on those structured objects - correctly match values to the options provided by Vitally (like account ID)</li>
                <li>Allow me to edit if I need prior to submitting</li>
                <li>Submit the custom object (called CXM Pulse) to Vitally via their custom objects api</li>
              </ol>
              <p className="text-muted-foreground mt-4">
                That sounded pretty feasible, but again — not an engineer — so I learned a ton while doing this. I started by simaltaneously tackling steps 1 and 5 at the same time. In my Replit repo — by the way, at this point I was using Replit because it was so much less duanting then having to set up an environment, download dependencies on my own, etc — I created small test interfaces to try each of these things:
              </p>
              <p className="text-muted-foreground mt-4">
                I landed on using the Asssembly AI api for transcription and built a test of that, it worked great.
              </p>
              <p className="text-muted-foreground mt-4">
                I used Postman (along with Vitally docs) to figure out exactly what my request to the vitally api would need to look like and then tried sending a similar request with a simple text based form in replit.
              </p>
              <p className="text-muted-foreground mt-4">
                I was feeling pretty decent, I had the input and I had the submission down. Now I needed to convert that input into the submission/request structure. I used the anthropic API to make that happen (ie. output JSON only with these fields). So I found myself with a parsed output that looked like this:
              </p>
              
              <div className="bg-muted/30 p-4 rounded-md my-4 font-mono text-sm">
                <pre>{`{
  "user_email": "(email of the user of the tool)",
  "account-name": "(claude's best guess at the account name based on my transcript)",
  "title": "",
  "status": "(healthy, concerning, or poor)",
  "explanation": ""
}`}</pre>
              </div>
              
              <p className="text-muted-foreground mt-4">
                Title, status, and explanation all matched the formats vitally required, but user_email and account name did not. Vitally needed a vitally userId and customerId for the account (a Vitally assigned Uuid). userId was easy, I would just call the Vitally API with the user email and get the uuid back. But because I didn't have an exact account name and Vitally didn't have account-name based search via api anyways, I needed to figure out how to get customerId.
              </p>
              <p className="text-muted-foreground mt-4">
                I landed on, ultimately, calling the Vitally API for a list of accounts (name and id) once a day and cacheing it and then when anthropic returned a rough account name, the tool would fuzzy find the top match and choose it's id based off that list.
              </p>
              <p className="text-muted-foreground mt-4">
                I knew it would get things wrong, so the form (that it filled out in real time) needed to be really easily editable, too. (Searchable dropdowns for accounts, etc.).
              </p>
              <p className="text-muted-foreground mt-4">
                By the end of it, I had nailed all the MVP requirements and it looked half decent, too.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">The Impact</h3>
              <p className="text-muted-foreground">
                This quickly became my go-to workflow for logging customer insights. I used it pretty much daily for more than a year. It wasn't just faster—it actually made me more likely to log updates consistently because it took away the friction of manual data entry — I often did these along with my customer check-ins on walks!
              </p>
              <p className="text-muted-foreground mt-4">
                While I never fully rolled it out to the team, it was one of my favorite personal tools. This is the kind of AI in the workplace that I get excited about—tools that let humans focus on what they do best (talking to customers) while offloading the annoying stuff to automation.
              </p>
              <p className="text-muted-foreground mt-4">
                I do think there's significant opportunity in tools like this and hope to build something like this that's a tad more scaleable. Given that my version was only intended for my own use, it didn't have auth and probably had some glaring security flaws, but I'd love to take a second shot at something similar.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="py-2">
          <div className="w-full border-t-2 border-foreground/10"></div>
        </div>

        {/* Conclusion */}
        <section>
          <p className="text-muted-foreground">
            Over the years, I've loved building tons of other internal tools. I built a bunch of Zapier automations—one of my favorites being 100+ step workflows with custom blocks. I put together fundraising CRMs to power our raises, internal report generation tools, and Streamlit apps to speed up workflows.
          </p>
          <p className="text-muted-foreground mt-4">
            I'm not an engineer, but I had a lot of fun tinkering with these things, thinking through their logic & requirements, and learning as I went along. Using AI coding assistants so aggressively also made it abundantly clear to me how AI will continue to expand people's abilities — I would not have been able to build these tools 2+ years ago at remotely the same speed.
          </p>
        </section>
      </div>
    </BlogLayout>
  );
} 