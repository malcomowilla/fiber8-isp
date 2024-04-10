import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

export function EditPayment() {
  return (
    <Dialog>
      <DialogTrigger asChild style={{color: 'green'}}>

        <IconButton style={{color: 'black' }}>
      <EditIcon />
</IconButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        
        <section className="bg-white dark:bg-gray-900 ">
  <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Update Payment</h2>
      <form action="#">
          <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Shortcode/paybill</label>
                  <input type="text" name="name" id="name" className="bg-gray-50 border
                   border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 
                   block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                   dark:focus:ring-primary-500 dark:focus:border-primary-500"   required=""/>
              </div>
              <div className="w-full">
                  <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mpesa Confirmation Code</label>
                  <input type="text" name="brand" id="brand"
                   className="bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-lg focus:ring-primary-600 
                    focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                       required=""/>
              </div>
              <div className="w-full">
                  <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
                  <input type="number"
                   name="price" id="price" className="bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                     block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                      dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                       required=""/>
              </div>
              <div>
                  <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subscriber</label>
                  <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                      <option selected="">Electronics</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                  </select>
              </div>
              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input type="text" name="item-weight" id="item-weight" 
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                     dark:focus:border-primary-500"   required=""/>
              </div> 



              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Subscribed</label>
                  <input type="datetime-local" name="item-weight" id="item-weight" 
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                     dark:focus:border-primary-500"  />
              </div> 




              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Valid Until</label>
                  <input type="datetime-local" name="item-weight" id="item-weight" 
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                     dark:focus:border-primary-500"  placeholder="Ex. 12" />
              </div> 

              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Claimed On</label>
                  <input type="date" name="item-weight" id="item-weight" 
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                     dark:focus:border-primary-500"  placeholder="Ex. 12" required=""/>
              </div> 




              <div>
                  <label htmlFor="item-weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Claimed By</label>
                  <input type="text" name="item-weight" id="item-weight" 
                  className="bg-gray-50 border border-gray-300 text-gray-900
                   text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                    block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 
                     dark:focus:border-primary-500"  placeholder="+254791568852" required=""/>
              </div> 
          </div>
          <div className="flex items-center space-x-4">
              <button type="submit" className="dark:text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Create Subscription
              </button>
              <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                  <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                  Delete
              </button>
          </div>
      </form>
  </div>
</section>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
