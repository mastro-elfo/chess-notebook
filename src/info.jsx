import React from 'react';
import {ICONS} from './icons';
import {Link} from 'react-router-dom';

export default class Info extends React.Component {
	render(){
		return (
			<section className="Info">
				<header>
					<div>
						<Link to="/settings" className="button left">
							<div><img alt="back" src={ICONS['back']}/></div>
						</Link>
						<h1>Info</h1>
					</div>
				</header>
				<main>
					<div>
						<h2>License</h2>
						<ul className="list">
							<li>
								<p><code>
Copyright (c) 2017 mastro-elfo<br/>
<br/>
Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:<br/>
<br/>
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.<br/>
<br/>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
								</code></p>
							</li>
						</ul>

						<h2>Credits</h2>
						<ul className="list">
							<li>
								<p>Chess pieces</p>
								<p>By jurgenwesterhof (adapted from work of Cburnett) - <a class="external free" href="http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces">http://commons.wikimedia.org/wiki/Template:SVG_chess_pieces</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=35634436">Link</a></p>
							</li>
						</ul>
					</div>
				</main>
			</section>
		);
	}
}
